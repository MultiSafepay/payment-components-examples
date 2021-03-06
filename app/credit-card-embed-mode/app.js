getApiToken().then(apiToken => {

    fetch(config.orderExamplesPath + 'creditcard.json', headers).then(function(response){
        return response.json();
    }).then(function(myJson) {
        exampleConfigOrder = myJson;
        //Add custom setting after load the settings file
        exampleConfigOrder.template = {
            settings: {
                embed_mode: true
            }
        };
        const multiSafepay = new MultiSafepay({
            env : 'TEST',
            apiToken : apiToken,
            order : exampleConfigOrder
        });
    

        const paymentButton = document.querySelector('#paymentButton');
        /* Enabling line below, payment button will be disabled until data is filled correctly */
        paymentButton.setAttribute('disabled', '');

        multiSafepay.init('payment', {
            container: '#MSPPayment',
            gateway: 'CREDITCARD',
            onError: state => {
                console.log('onError', state);
            },
            /* Enabling line below, payment button will be disabled until data is filled correctly */
            onValidation: state => {
                if(state.valid) {
                    paymentButton.removeAttribute('disabled');
                } else {
                    paymentButton.setAttribute('disabled', '');
                }
            },
            onLoad: state => {
                console.log('Component mounted', state);
            }
        }); 

        paymentButton.addEventListener('click', e => {
            if (multiSafepay.hasErrors()) {
                let errors = multiSafepay.getErrors();
                console.log(errors);
                return false;
            }
            paymentButton.setAttribute('disabled','');
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
