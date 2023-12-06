# Node Polish Payments Library

A library for handling Polish online payments.

## Contact

If you have questions or want to get in touch, you can use the details below:

- Discord: @mid_plug
- E-mail: kontakt@justdoweed.pl

Don't hesitate to ask anything!

## Installation

Install the library using npm:

``bash
npm install node-polish-payments

```

```

## Examples of use (Paybylink)

Generation Payment (Transfer/Blik)

```js
import {
  PaybylinkTransfer,
  PaybylinkGenerateTransferSignature,
} from 'node-polish-payments';

const paybylinkTransfer = new PaybylinkTransfer('secretKey', shopId);

paybylinkTransfer.price = 1.0; // (REQUIRED)
// paybylinkTransfer.control = ''; (NOT REQUIRED)
// paybylinkTransfer.description = ""; (NOT REQUIRED)
// paybylinkTransfer.email = ""; (NOT REQUIRED)
// paybylinkTransfer.notifyURL = ""; (NOT REQUIRED) | After the payment is made, a POST request will be sent to this address as to whether the transaction was successful/unsuccessful
// paybylinkTransfer.returnUrlSuccess = ""; (NOT REQUIRED)
// paybylinkTransfer.returnUrlSuccessTidPass = true; (NOT REQUIRED)

const createTransfer = await paybylinkTransfer.createTransfer();

if (createTransfer.data && createTransfer.data.url) {
  // After creating the payment correctly in json, we get { url: '', transactionId: '' }
  const transactionUrl = createTransfer.data.url;
  const transactionId = createTransfer.data.transactionId;
  console.log(
    `TRANSACTION CREATED\nID: ${transactionId}\nURL: ${transactionUrl}`
  );
} else {
  // If you receive an error it will be in the format: { errorCode: 404, error: "Here some error" }
  // 400 Error decoding data into JSON format
  // 401 Wymanage fields not specified
  // 402 Field size invalid
  // 403 Invalid query signature
  // 404 Store id not found
  // 500 Internal error during transaction generation
  // 200 All ok transaction has been generated.
  console.log('ERROR: ', createTransfer);
}

// This is the signature which is also calculated and sent when creating a payment if we use the notification because someone bought a product in our store, for example, then to verify the authenticity of the payment we can download his signature when creating the payment, save it to the database and in how we will receive the response from paybylink in it will also be a signature and we will simply compare it for a given transactionId in this way we have secured the transaction on the notfyikation side
const paybylinkSignature = new PaybylinkGenerateTransferSignature(
  'secretKey',
  shopId
);
paybylinkSignature.price = 1.0; // (REQUIRED)
// paybylinkSignature.control = ''; (NOT REQUIRED)
// paybylinkSignature.description = ""; (NOT REQUIRED)
// paybylinkSignature.email = ""; (NOT REQUIRED)
// paybylinkSignature.notifyURL = ""; (NOT REQUIRED) | After the payment is made, a POST request will be sent to this address as to whether the transaction was successful/unsuccessful
// paybylinkSignature.returnUrlSuccess = ""; (NOT REQUIRED)
// paybylinkSignature.returnUrlSuccessTidPass = true; (NOT REQUIRED)
const generateSignature = await paybylinkSignature.generateSignature();
console.log(generateSignature);
```

SMS validation

```js
import { PaybylinkSms } from 'node-polish-payments';

// Initialize PaybylinkSms with user and service IDs
const payByLinkSms = new PaybylinkSms('userId', 'serviceId');

// Set code and number properties (replace with actual values)
payByLinkSms.code = '';
payByLinkSms.number = '';

const validateSms = await payByLinkSms.validateSms();
if (validateSms.data.status === 1) {
  // We will receive in JSON: { status:, service:, number:, phone:, reply: '' } (Of course, the fields will be populated with the correct data, unless the code has already been used then each field will be 0)
  console.log('THE ENTERED CODE IS CORRECT');
} else if (validateSms.data.errorCode === 1) {
  // We will receive in JSON: { connect: false, data: { errorCode: 1, message: 'Code does not exist' } }
  console.log('THE ENTERED CODE IS INCORRECT.');
} else if (validateSms.data.errorCode === 2) {
  // We will receive in JSON: { connect: false, data: { errorCode: 2, message: 'User or service does not exist' } }
  console.log('INVALID USER OR SERVICE');
} else {
  // We will receive in JSON: { connect: false, data: { errorCode: 0, message: 'Connection error' } }
  console.log('INVALID REQUEST (POSSIBLY MISSING INFORMATION)');
}
```
