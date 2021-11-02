const serversUrl = {
    PHP: '../../server/php/',
    NODEJS: 'http://localhost:5000/'
}

const config = {
    backendUrl: serversUrl[serverSettings.type],
    orderExamplesPath: '../../server/order_examples/'
}

let exampleConfigOrder = {
    customer: {
        country: 'NL',
        locale: 'en',
    },
    currency: 'EUR',
    amount: 10000
}

const headers = {
    headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

console.log('config', config);
console.log('exampleConfigOrder', exampleConfigOrder);

const setPath = (path) => {
    let endPoint = config.backendUrl + path;
    return endPoint;
}

// Generic POST Helper
const httpPost = (endpoint, data) =>
    fetch(`${setPath(endpoint)}`, {
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then(response => response.json());

const setOrder = (orderData) => {
    debugRequest(orderData);

    return httpPost('setOrder', orderData)
        .then(response => {
            if (response.error) {
                throw 'Error creating order';
            }
            debugResponse(response);
            return response;
        })
        .catch(console.error);
}

const getApiToken = () =>
    httpPost('apiToken')
        .then(response => {
            if (response.error) {
                throw 'Invalid api token';
            }
            debugResponse(response);
            return response.api_token;
        })
        .catch(console.error);
    