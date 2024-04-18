const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const fs = require('fs');

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

const generateOrderId = (pre) => {
    const n = Math.floor(Math.random() * 11);
    const k = Math.floor(Math.random() * 1000000);
    const m = n + k;
    return (pre ? (pre + m) : m);
}

const sendRequest = async (method, path, args = {}) => {
    let request = {
        headers: {
            'api_key': process.env.API_KEY
        },
        method: method,
        url: process.env.API_ENDPOINT + path
    };
    const methodWithBody = ['POST', 'PUT', 'PATCH'];
    if (methodWithBody.indexOf(method) > -1) {
        request['data'] = args;
    }
    return axios(request).then((response) => {
        return response.data;
    })
    .catch((e) => {
        //console.log(e);
        return e;
     });
};

app.post('/apiToken', (req, res) => {
    sendRequest('GET', 'json/auth/api_token', []).then((apiResponse) => {
        res.send(JSON.stringify(apiResponse['data']));
    });
});

app.post('/setOrder', (req, res) => {
    let orderData = {};
    //In this request, merchant integration should add the rest of information of the order.
    //For the example we load a static file under order_examples folder.
    //req.body contains payment_data and order information from components.

    if (req.body && req.body.payment_data.gateway) {
        let gateway = req.body.payment_data.gateway.toLowerCase();
        const orderExampleFile = '../../order_examples/' + gateway + '.json';
        const path = require('path');
        const orderPath = path.resolve(__dirname, orderExampleFile);
        if (fs.existsSync(orderPath)) {
            orderData = require(orderExampleFile);
        }
    }
    orderData['order_id'] = generateOrderId('payment-comp');
    const params = { ...req.body, ...orderData };
    sendRequest('POST', 'json/orders', params).then((apiResponse) => {
        res.send(JSON.stringify(apiResponse));
    });
});

app.post('/getRecurringTokens', (req, res) => {
    let customerReference = 'shopper-456'; //Customer reference should be taken from DB or user session, not exposed to the browser or client.
    sendRequest('GET', 'json/recurring/' + customerReference).then((apiResponse) => {
        let result = {
            model: 'cardOnFile',
            tokens: (
                apiResponse.success && 
                apiResponse.data && 
                apiResponse.data.tokens ? 
                apiResponse.data.tokens : 
                []
            ),
        };
        res.send(JSON.stringify(result));
    });
});

app.listen(5000, () => console.log(`Listening port 5000`));
