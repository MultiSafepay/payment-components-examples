var App = {
    paymentButton : null,
    multiSafepay : null,
    init : function() {
        this.paymentButton = document.querySelector('#paymentButton');
        $.post( envConfig.backendUrl + 'apiToken', function( res ) {
            App.multiSafepay = new MultiSafepay({
                env : envConfig.ENV,
                apiToken : res.api_token,
                order : exampleConfigOrder
            });

            App.multiSafepay.init('payment', {
                container: '#MSPPayment',
                gateway: 'CREDITCARD',
                onError: function( state ){
                    console.log('onError', state);
                }
            });
        });

        this.paymentButton.addEventListener('click', function(e) {
            if (App.multiSafepay.hasErrors()) {
                let errors = multiSafepay.getErrors();
                console.log(errors);
                return false;
            }
            $.ajax( envConfig.backendUrl + 'setOrder', {
                data : JSON.stringify(App.multiSafepay.getOrderData()),
                contentType : 'application/json',
                type : 'POST',
                success: function( res ) {
                    console.log(res)
                    if(!res.success) {
                    console.log(res);
                    } else {
                        App.multiSafepay.init('redirection', {
                            order: res.data
                        });
                    }
                }
            });
        });
    }
}

App.init();
