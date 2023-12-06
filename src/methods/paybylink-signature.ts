const axios = require('axios');
const crypto = require('crypto');

export class PaybylinkGenerateTransferSignature {
  private secretKey: string;
  private shopId: number; // Required
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

  generateSignature(): string {
    let signatureInput = `${this.secretKey}|${this.shopId}|${this.price.toFixed(
      2
    )}`;

    if (this.control) {
      signatureInput += `|${this.control}`;
    }
    if (this.description) {
      signatureInput += `|${this.description}`;
    }
    if (this.email) {
      signatureInput += `|${this.email}`;
    }
    if (this.notifyURL) {
      signatureInput += `|${this.notifyURL}`;
    }
    if (this.returnUrlSuccess) {
      signatureInput += `|${this.returnUrlSuccess}`;
    }
    if (this.returnUrlSuccessTidPass) {
      signatureInput += `|${this.returnUrlSuccessTidPass}`;
    }

    return crypto.createHash('sha256').update(signatureInput).digest('hex');
  }
}
