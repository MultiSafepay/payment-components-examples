/**
 * Helper library to simulate webshop client requests to backend a backend api
 * getApiToken
 * setOrder
 */


const apiHelperJsLoader = (jsFilePath, timeout) => {
    setTimeout(function() {
        let js = document.createElement("script");
        js.type = "text/javascript";
        js.src = jsFilePath;
        document.body.appendChild(js);
    }, (timeout || 0));
};

//Load config and utils for demo
apiHelperJsLoader("config.js");
apiHelperJsLoader("/assets/js/utils.js");
const headers = {
    headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

const setPath = (path) => {
    if( envConfig.backendUrl == undefined) {
        throw 'envConfig not defined';
    }
    console.log('config', envConfig);
    let endPoint =  envConfig.backendUrl + path;
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

