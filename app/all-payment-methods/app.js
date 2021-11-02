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

        const paymentButton = document.querySelector('#paymentButton');
    
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
            }
        });

        paymentButton.addEventListener('click', e => {
            if (multiSafepay.hasErrors()) {
                let errors = multiSafepay.getErrors();
                console.log(errors);
                return false;
            }
            setOrder(multiSafepay.getOrderData()).then(response => {
                if(!response || !response.success) {
                    paymentButton.removeAttribute('disabled');
                    console.log(response);
                } else {
                    multiSafepay.init('redirection', {
                        order: response.data
                    });
                }
            });
        });
    });
});
