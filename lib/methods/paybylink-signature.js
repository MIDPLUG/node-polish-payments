"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaybylinkGenerateTransferSignature = void 0;
const axios = require('axios');
const crypto = require('crypto');
class PaybylinkGenerateTransferSignature {
    constructor(secretKey, shopId) {
        this.price = 0.0; // Required
        this.control = '';
        this.description = '';
        this.email = '';
        this.notifyURL = '';
        this.returnUrlSuccess = '';
        this.returnUrlSuccessTidPass = false;
        this.secretKey = secretKey;
        this.shopId = shopId;
    }
    generateSignature() {
        let signatureInput = `${this.secretKey}|${this.shopId}|${this.price.toFixed(2)}`;
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
exports.PaybylinkGenerateTransferSignature = PaybylinkGenerateTransferSignature;
