"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaybylinkTransfer = void 0;
const axios = require('axios');
const crypto = require('crypto');
class PaybylinkTransfer {
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
    createTransfer() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = 'https://secure.paybylink.pl/api/v1/transfer/generate';
            const requestBody = {
                shopId: this.shopId,
                price: this.price,
            };
            let signatureInput = `${this.secretKey}|${this.shopId}|${this.price.toFixed(2)}`;
            const addFieldToRequest = (fieldName, value) => {
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
                const response = yield axios.post(apiUrl, requestBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                return {
                    data: response.data,
                };
            }
            catch (error) {
                console.error('[PAYBYLINK TRANSFER] ', error.message);
                return {
                    data: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || { error: 'Internal Server Error' },
                };
            }
        });
    }
}
exports.PaybylinkTransfer = PaybylinkTransfer;
