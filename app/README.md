
# MultiSafepay Component examples
The `app` folder contains a set  of examples for connect components.
You can just review the code for understanding how should be integrated or even run the examples.

### assets folders
Css for stilish the examples
Js helper library for understanding how to handle the requests from client to server side, specially see:
`getApiToken`
`setOrder`
`getRecurringTokens`

### Example folders
**index.html**
Basic html, with `exampleConfigOrder` for different settings.

**app.js**
Examples how to initialize the components and use different settings and methods.

***Run the examples***

1) Run available servers Php, Node, ...(see `server` folder)
Default will run in port 5000

2) Edit config.js to match the backend server url, environment, etc...

3) Access the examples running:

```
php -S localhost:5001
```
open in browser

http://localhost:5001


or run directly in your server

http://localhost/index.html
https://your-server-url.com/index.html
