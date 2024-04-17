getApiToken().then(apiToken => {
    const multiSafepay = new MultiSafepay({
        env: envConfig.ENV,
        apiToken: apiToken,
        order: exampleConfigOrder
    });

    const paymentButton = document.querySelector('#paymentButton');
    paymentButton.setAttribute('disabled', '');

    multiSafepay.init('payment', {
        container: '#MSPPayment',
        gateway: 'IDEAL',
        onSelect: state => {
            console.log('onSelect', state);
            paymentButton.removeAttribute('disabled');
        },
        onError: state => {
            console.log('onError', state);
        }
    });

    paymentButton.addEventListener('click', e => {
        if (multiSafepay.hasErrors()) {
            let errors = multiSafepay.getErrors();
            console.log(errors);
            return false;
        }

        setOrder(multiSafepay.getOrderData()).then(response => {

            paymentButton.setAttribute('disabled', '');

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
