getApiToken().then(apiToken => {

    fetch(config.orderExamplesPath + 'dropin.json', headers).then(function(response){
        return response.json();
    }).then(function(myJson) {
        exampleConfigOrder = myJson;

        const multiSafepay = new MultiSafepay({
            env : 'TEST',
            apiToken : apiToken,
            order: exampleConfigOrder
        });
    
        multiSafepay.init('dropin', {
            container : '#MSPDropin',
            onSelect : state => {
                console.log('onSelect', state);
            }, 
            onError : state => {
                console.log('onError', state);
            },
            onLoad : state => {
                console.log('onLoad', state);
            },
            onSubmit : state => {
                if(multiSafepay.hasErrors()) {
                    let errors = multiSafepay.getErrors();
                    console.log(errors);
                    return;
                }
                
                setOrder(multiSafepay.getOrderData()).then(response => {
                    console.log(response);
                    if(response.success) {
                        multiSafepay.init('redirection', {
                            order: response.data
                        });
                    }
                });
            }
        });
    });
});
