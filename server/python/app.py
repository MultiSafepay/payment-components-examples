from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import random, string
import os
import sys
import json
from dotenv import load_dotenv
import requests

load_dotenv()

def generateOrderId(pre, length=10):
   letters = string.ascii_lowercase
   return pre + ''.join(random.choice(letters) for i in range(length))

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/apiToken', endpoint='apiToken', methods=['POST'])
@app.route('/setOrder', endpoint='setOrder', methods=['POST'])
@app.route('/getRecurringTokens', endpoint='getRecurringTokens', methods=['POST'])
@cross_origin()

def create():
    API_ENDPOINT = os.getenv('API_ENDPOINT')
    API_KEY = os.getenv('API_KEY')
    requestHeaders = {"api_key": API_KEY }
    if request.endpoint == 'apiToken':
        response = requests.get(API_ENDPOINT + 'json/auth/api_token', headers=requestHeaders)
        apiResponse = json.loads(response.text)
        apiResponse = apiResponse['data'] if response.ok else {}
    
    if request.endpoint == 'setOrder':
        orderData = {}
        #In this request, merchant integration should add the rest of information of the order.
        #For the example we load a static file under order_examples folder.
        #request.data contains payment_data and order information from components.

        orderRequest = json.loads(request.data)
        gateway = orderRequest['payment_data']['gateway'].lower();
        
        orderExampleFile = '../order_examples/' + gateway + '.json';
        if os.path.isfile(orderExampleFile) :
            f = open(orderExampleFile)
            orderData = json.load(f)
            orderData = {**orderData,**orderRequest,}
            f.close()

        orderData['order_id'] = generateOrderId('payment-comp-py');
   
        response = requests.post(API_ENDPOINT + 'json/orders', json=orderData, headers=requestHeaders)
        apiResponse = json.loads(response.text)

    if request.endpoint == 'getRecurringTokens':
        #Customer reference should be taken from DB or user session, not exposed to the browser or client.
        customerReference = 'shopper-456'
        response = requests.get(API_ENDPOINT + 'json/recurring/' + customerReference, headers=requestHeaders)
        apiResponse = json.loads(response.text)
        apiResponse = apiResponse['data'] if response.ok else {}
    
    print(apiResponse, file=sys.stderr)
    return jsonify(apiResponse)

if __name__ == '__main__':
    app.run(debug=True, port='5000')