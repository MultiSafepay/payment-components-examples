const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const fs = require('fs');

const sendRequest = async (method, path, args = {}) => {
    let request = {
        headers: {
            'api_key': process.env.API_KEY
        },
        method: method,
        url: process.env.API_ENDPOINT + path   
    };
    const methodWithBody = ['POST', 'PUT', 'PATCH'];
    if(methodWithBody.indexOf(method) > -1){
        request['data'] = args;
    }
    
    return axios(request).then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });   
};

const generateOrderId = () => {
    const n = Math.floor(Math.random() * 11);
    const k = Math.floor(Math.random() * 1000000);
    const m = n + k;
    return m;
}

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ 
    extended: true 
}));

app.post('/apiToken', (req, res) => {
    sendRequest('GET', 'auth/api_token', []).then((apiResponse) => {
        res.send(JSON.stringify(apiResponse['data']));
    });
});

app.post('/setOrder', (req, res) => {
    let orderData = null;
    if (req.body.gateway) {
        const orderExampleFile = '../../order_examples/'+ req.body.gateway.toLowerCase() + '.json';
        const path = require('path');
        const orderPath = path.resolve(__dirname, orderExampleFile);
        if (fs.existsSync(orderPath)) {
            orderData = require(orderExampleFile);
            orderData['order_id'] = generateOrderId();
        }
    }
    const params = orderData ? {...req.body, ...orderData} : req.body;
    sendRequest('POST', 'orders', params).then((apiResponse) => {
        res.send(JSON.stringify(apiResponse));
    });
});

app.listen(5000, () => console.log(`Listening port 5000`));
