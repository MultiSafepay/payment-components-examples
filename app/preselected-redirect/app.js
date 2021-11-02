getApiToken().then(apiToken => {

    fetch(config.orderExamplesPath + 'ideal.json', headers).then(function(response){
        return response.json();
    }).then(function(myJson) {
        exampleConfigOrder = myJson;
        const multiSafepay = new MultiSafepay({
            env : 'TEST',
            apiToken : apiToken,
            order : exampleConfigOrder
        });

        const paymentButton = document.querySelector('#paymentButton');
        paymentButton.setAttribute('disabled', '');
        multiSafepay.init('payment', {
            container: '#MSPPayment',
            gateway: 'IDEAL',
            onSelect: state => {
                console.log('onSelect', state);
                paymentButton.removeAttribute('disabled');
            }
        }); 

        paymentButton.addEventListener('click', e => {
            if (multiSafepay.hasErrors()) {
                let errors = multiSafepay.getErrors();
                console.log(errors);
                return false;
            }

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
});