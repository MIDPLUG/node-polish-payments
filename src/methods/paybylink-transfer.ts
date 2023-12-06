const axios = require('axios');
const crypto = require('crypto');

export class PaybylinkTransfer {
  private secretKey: string;
  private shopId: number;
  public price = 0.0; // Required
  public control = '';
  public description = '';
  public email = '';
  public notifyURL = '';
  public returnUrlSuccess = '';
  public returnUrlSuccessTidPass = false;

  constructor(secretKey: string, shopId: number) {
    this.secretKey = secretKey;
    this.shopId = shopId;
  }

  async createTransfer(): Promise<any> {
    const apiUrl = 'https://secure.paybylink.pl/api/v1/transfer/generate';

    const requestBody: any = {
      shopId: this.shopId,
      price: this.price,
    };

    let signatureInput = `${this.secretKey}|${this.shopId}|${this.price.toFixed(
      2
    )}`;

    const addFieldToRequest = (fieldName: string, value: any) => {
      if (value !== undefined && value !== null && value !== '') {
        requestBody[fieldName] = value;
        signatureInput += `|${value}`;
      }
    };

    addFieldToRequest('control', this.control);
    addFieldToRequest('description', this.description);
    addFieldToRequest('email', this.email);
    addFieldToRequest('notifyURL', this.notifyURL);
    addFieldToRequest('returnUrlSuccess', this.returnUrlSuccess);
    addFieldToRequest('returnUrlSuccessTidPass', this.returnUrlSuccessTidPass);

    const finalSignature = crypto
      .createHash('sha256')
      .update(signatureInput)
      .digest('hex');

    requestBody.signature = finalSignature;

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data,
      };
    } catch (error: any) {
      console.error('[PAYBYLINK TRANSFER] ', error.message);
      return {
        data: error.response?.data || { error: 'Internal Server Error' },
      };
    }
  }
}
