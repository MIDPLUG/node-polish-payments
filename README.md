# node-polish-payments
A library for handling Polish online payments.

## Contact
If you have questions or want to get in touch, you can use the details below:

- Discord: @mid_plug
- E-mail: kontakt@justdoweed.pl

## Installation
Install the library using npm:
```bash
npm install node-polish-payments
npm install axios
```

# Examples of use (Paybylink)
#### Payment (Transfer/Blik)
Initialization
```js
const { PaybylinkTransfer, PaybylinkGenerateTransferSignature } = require('node-polish-payments');

const paybylinkSignature = new PaybylinkGenerateTransferSignature("secretKey", shopId);
const paybylinkTransfer = new PaybylinkTransfer("secretKey", shopId);

```
Configuration of transfer options
```js
paybylinkTransfer.options.price = 5; // (REQUIRED)
paybylinkTransfer.options.control = ''; // (OPTIONAL)
paybylinkTransfer.options.description = ""; // (OPTIONAL)
paybylinkTransfer.options.email = ""; // (OPTIONAL)
paybylinkTransfer.options.notifyURL = ""; // (OPTIONAL)
paybylinkTransfer.options.returnUrlSuccess = ""; // (OPTIONAL)
paybylinkTransfer.options.returnUrlSuccessTidPass = true; // (OPTIONAL)
paybylinkTransfer.options.hideReceiver = true; // (OPTIONAL)
paybylinkTransfer.options.customFinishNote = 'Your custom note'; // (OPTIONAL)
```

Create a transfer
```js
const createTransfer = await paybylinkTransfer.createTransfer();

if (createTransfer.data && createTransfer.data.url) {
    // After creating the payment correctly in JSON, we get { url: '', transactionId: '' }
    const transactionUrl = createTransfer.data.url;
    const transactionId = createTransfer.data.transactionId;
    console.log(`TRANSACTION CREATED\nID: ${transactionId}\nURL: ${transactionUrl}`);
} else {
    // If you receive an error, it will be in the format: { errorCode: 404, error: "Here some error" }
    // 400 Error decoding data into JSON format
    // 401 Wymanage fields not specified
    // 402 Field size invalid
    // 403 Invalid query signature
    // 404 Store id not found
    // 500 Internal error during transaction generation
    // 200 All ok transaction has been generated.
    console.log("ERROR: ", createTransfer);
}
```

Example of validation of sent notification (EXPRESS.JS)
```js
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());

app.post('/', (req, res) => {
    const signature = paybylinkSignature.generate(req.body);
    if (signature === req.body.signature) {
        res.set('Content-Type', 'text/plan');
        return res.send("OK");
    }
});
```

#### Payment (Paysafecard)
Initialization
```js
const { PaybylinkPaysafecard } = require('node-polish-payments');
const paybylinkPaysafecard = new PaybylinkPaysafecard(userId, shopId, 'pin');
```

Configuration of Paysafecard options
```js
paybylinkPaysafecard.options.amount = 10; // (REQUIRED)
paybylinkPaysafecard.options.return_ok = 'http://yourwebsite.com/payment_success'; // (REQUIRED)
paybylinkPaysafecard.options.return_fail = 'http://yourwebsite.com/payment_failure'; // (REQUIRED)
paybylinkPaysafecard.options.url = 'http://yourwebsite.com/payment_receive.php'; // (REQUIRED)
paybylinkPaysafecard.options.control = '123456'; // (REQUIRED)
paybylinkPaysafecard.options.description = ''; // (OPTIONAL)
paybylinkPaysafecard.options.get_pid = true; // (OPTIONAL)
```

Generate a Paysafecard payment
```js
const payment = await paybylinkPaysafecard.generatePayment();
console.log(payment);

if (createTransfer.data && createTransfer.data.url) {
    // After creating the payment correctly in JSON, we get { url: '', transactionId: '' }
    const transactionUrl = createTransfer.data.url;
    const transactionId = createTransfer.data.transactionId;
    console.log(`TRANSACTION CREATED\nID: ${transactionId}\nURL: ${transactionUrl}`);
} else {
    // If you receive an error it will be in the format: { errorCode: code, error: "Here some error" }
    // 400 Error decoding data into JSON format
    // 401 Wymanage fields not specified
    // 402 Field size invalid
    // 403 Invalid query signature
    // 404 Store id not found
    // 500 Internal error during transaction generation
    // 200 All ok transaction has been generated.
    console.log(payment);
}
```

Example of validation of sent notification (EXPRESS.JS)
```js
const axios = require('axios');

app.post('/', async (req, res) => {
    const allowedIpsUrl = 'https://paybylink.pl/psc/ips/';
    const clientIp = req.headers['cf-connecting-ip'] || req.ip;

    const userId = process.env.USER_ID;
    const shopId = process.env.SHOP_ID;    

    try {
        if (req.body.userid !== userId || req.body.shopid !== shopId) {
            res.status(400).send('Invalid userId or shopId values.');
            return;
        }

        const response = await axios.get(allowedIpsUrl);
        const allowedIps = response.data.split(',').map((ip) => ip.trim());

        if (allowedIps.includes(clientIp)) {
            if (req.body === 'TRUE') {
                res.send(req.body);
            } else {
                res.status(403).send('Transaction unsuccessful.');
            }
        } else {
            res.status(403).send('Invalid IP address.');
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('An error occurred.');
    }
});
```

#### Payment (SMS PREMIUM)
Initialization
```js
const { PaybylinkSms } = require('node-polish-payments');
const paybylinkSms = new PaybylinkSms(userId, serviceId);
```

Configuration of SMS options
```js
paybylinkSms.code = 'your_sms_code'; // (REQUIRED)
paybylinkSms.number = 123456789; // (REQUIRED)
```

Check the SMS code
```js
const checkCodeResult = await paybylinkSms.checkCode();
console.log(checkCodeResult);
```

# Examples of use (COOMING SOON...)
