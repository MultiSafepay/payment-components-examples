getApiToken().then(apiToken => {

    const multiSafepay  = new MultiSafepay({
        env : envConfig.ENV,
        apiToken : apiToken,
        order : exampleConfigOrder
    });

    const paymentButton = document.querySelector('#paymentButton');
    setButtonStatus(paymentButton);

    multiSafepay.init('payment', {
        container: '#MSPPayment',
        gateway: 'CREDITCARD',
        onError: state => {
            console.log('onError', state);
        },
        onEvent: state => {
            console.log('onEvent', state);
        },
        onValidation: state => {
            if(state.valid) {
                paymentButton.removeAttribute('disabled');
                setButtonStatus(paymentButton);
            } else {
                setButtonStatus(paymentButton, true);
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
        setButtonStatus(paymentButton, true);
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
