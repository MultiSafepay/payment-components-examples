getApiToken().then(apiToken => {
    const multiSafepay = new MultiSafepay({
        env : envConfig.ENV,
        apiToken : apiToken,
        order: exampleConfigOrder
    });

    const paymentButton = document.querySelector('#paymentButton');
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
        }
    });

    paymentButton.addEventListener('click', e => {
        setButtonStatus(paymentButton, true);
        if (multiSafepay.hasErrors()) {
            let errors = multiSafepay.getErrors();
            console.log(errors);
            return false;
        }
        setOrder(multiSafepay.getOrderData()).then(response => {
            if(!response || !response.success) {
                console.log(response);
            } else {
                multiSafepay.init('redirection', {
                    order: response.data
                });
            }
            setButtonStatus(paymentButton);
        });
    });
});
