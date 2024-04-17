<?php
/**
 * MultiSafepay (https://www.multiSafepay.com/)
 */

namespace MultiSafepay;

use GuzzleHttp\Client;

class Api
{
    private $settings = [];
    private $client;
    private $apiEndpoint;
    /**
     * Initialize Client
     *
     * @param string $apiEndpoint Api environment endpoint
     * @param array  $settings    Settings required by the api like, api_key
     */
    public function __construct(string $apiEndpoint, array $settings = null)
    {
        $this->client = new Client();
        $this->apiEndpoint = $apiEndpoint;
        $this->settings = $settings;
    }
    
    /**
     * Creates order request
     *
     * @param array $orderData Generic order structure
     * 
     * @return object Order status response or error - Generic from api. 
     */
    public function setOrder($orderData)
    {
        return $this->sendRequest('POST', 'json/orders', $orderData);
    }
    
    /**
     * Obtain the api_token that can be published
     *
     * @return object Api token or error response.
     */
    public function getApiToken()
    {
        return $this->sendRequest('GET', 'json/auth/api_token');
    }
    
    /**
     * Helper for Api requests
     *
     * @param string $method    Http request method
     * @param string $path      Specific request to the api endpoint
     * @param array  $orderData Standard order Structure
     * 
     * @return void
     */
    private function sendRequest(
        string $method, 
        string $path, 
        array $orderData = null
    ) {
        $req = [
            'headers' => [
                'api_key' => $this->settings['api_key']
            ]
        ];
        if (in_array($method, [
                'POST', 'PATCH', 'PUT'
            ]
        )
) {
            $req['json'] = $orderData;
        }

        try {
            $response = $this->client->request(
                $method,
                $this->apiEndpoint.''.$path,
                $req
            );
        } catch (GuzzleHttp\Exception\ClientException $e) {
            throw new \Exception($e->getResponse());
        }
        return json_decode($response->getBody()->getContents());
    }
}
