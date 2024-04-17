getApiToken().then(apiToken => {
    const multiSafepay = new MultiSafepay({
        env: envConfig.ENV,
        apiToken : apiToken,
        order : exampleConfigOrder
    });

    const paymentButton = document.querySelector('#paymentButton');

    multiSafepay.init('payment', {
        container: '#MSPPayment',
        gateway: 'PAYPAL',
        onLoad: state => {
            console.log('onLoad', state);
        },
        onError: state => {
            console.log('onError', state);
        }
    }); 

    paymentButton.addEventListener('click', e => {
        setOrder(multiSafepay.getOrderData()).then(response => {
            paymentButton.setAttribute('disabled','');
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
