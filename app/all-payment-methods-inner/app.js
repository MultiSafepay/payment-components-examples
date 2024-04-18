getApiToken().then(apiToken => {
    const multiSafepay = new MultiSafepay({
        env : envConfig.ENV,
        apiToken : apiToken,
        order: exampleConfigOrder
    });

    multiSafepay.init('dropin', {
        container : '#MSPPayment',
        onSelect : state => {
            console.log('onSelect', state);
        },
        onEvent: state => {
            console.log('onEvent', state);
        },
        onError : state => {
            console.log('onError', state);
        },
        onLoad : state => {
            console.log('onLoad', state);
        },
        onSubmit : state => { //Adding onSubmit method, sets the flow for inner button.
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
