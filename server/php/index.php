<?php

require 'app/autoload.php';

$dotenv = Dotenv\Dotenv::create(__DIR__);
$dotenv->load();

header('Content-Type: application/json; charset=utf-8');

$route = array_filter(
    explode(
        '/', 
        urldecode(
            parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
        )
    )
);
$action = end($route);

$config = [
    'api_key' => getenv('API_KEY'),
    'locale' => 'en',
];
$response = [
    'success' => false,
    'message' => ''
];

$postData = json_decode(file_get_contents('php://input'), true);
try {
    $api = new \MultiSafepay\Api(getenv('API_ENDPOINT'), $config);
    switch($action) {
    case 'apiToken';
        $response = $api->getApiToken()->data;
        break;
    case 'setOrder';
        $order = [];
        if (!empty($postData['payment_data']['gateway'])) {
            $orderExample = '../order_examples/'.strtolower(
                $postData['payment_data']['gateway']
            ).'.json';
            if (!file_exists($orderExample)) {
                $orderExample = null;
            }

            if(empty($orderExample)) {
                $orderExample = '../order_examples/order.json';
            }

            $order = json_decode(file_get_contents($orderExample), true);
            $order = array_replace_recursive(
                $order, (
                !empty($postData) ? $postData : []
                )
            );
        }

        $order['order_id'] = uniqid('payment-comp');
        $response = $api->setOrder($order);
        break;
    default;
        if (!empty($action)) {
            throw new \Exception('Path is not correct');
        }
        $response = [
            'success' => true,
            'message' => 'MultiSafepay Payment Components Example'
        ];
    }
}catch(\Exception $e) {
    $response = [
        'success' => false,
        'message' => $e->getMessage()
    ];
}

echo json_encode($response);
die;
