var App = {
    backendUrl : '../../server/php/',
    orderExamplesPath: '../../server/order_examples/',
    paymentButton : null,
    paymentToken : null,
    multiSafepay : null,
    exampleConfigOrder : {
        customer: {
            country: 'NL',
            reference: 'XXX',
        },
        currency: 'EUR',
        amount: 10000
    },

    init : function() {
        this.paymentButton = document.querySelector('#paymentButton');
        $.post( App.backendUrl + 'apiToken', function( res ) {
            const headers = {
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            fetch(App.orderExamplesPath + 'creditcard.json', headers).then(function(response){
                return response.json();
            }).then(function(myJson) {
                App.exampleConfigOrder = myJson;

                App.multiSafepay = new MultiSafepay({
                    env : 'TEST',
                    apiToken : res.api_token,
                    order : App.exampleConfigOrder
                });

                App.multiSafepay.init('payment', {
                    container: '#MSPPayment',
                    gateway: 'CREDITCARD',
                    onError: function( state ){
                        console.log('onError', state);
                    }
                });
            });
        });

        this.paymentButton.addEventListener('click', function(e) {
            if (App.multiSafepay.hasErrors()) {
                let errors = multiSafepay.getErrors();
                console.log(errors);
                return false;
            }
            $.ajax( App.backendUrl + 'setOrder', {
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
