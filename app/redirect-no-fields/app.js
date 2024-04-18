getApiToken().then(apiToken => {
    const multiSafepay = new MultiSafepay({
        env: envConfig.ENV,
        apiToken : apiToken,
        order : exampleConfigOrder
    });

    const paymentButton = document.querySelector('#paymentButton');
    setButtonStatus(paymentButton);
    multiSafepay.init('payment', {
        container: '#MSPPayment',
        gateway: 'PAYPAL',
        onLoad: state => {
            console.log('onLoad', state);
        },
        onEvent: state => {
            console.log('onEvent', state);
        },
        onError: state => {
            console.log('onError', state);
        }
    }); 

    paymentButton.addEventListener('click', e => {
        setButtonStatus(paymentButton, true);
        setOrder(multiSafepay.getOrderData()).then(response => {
            setButtonStatus(paymentButton);
            if (!response.success) {
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
