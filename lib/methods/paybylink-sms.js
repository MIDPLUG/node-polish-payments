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
exports.PaybylinkSms = void 0;
const axios = require('axios');
const crypto = require('crypto');
class PaybylinkSms {
    constructor(userId, serviceId) {
        this.code = ''; // Required
        this.number = ''; // Required
        this.userId = userId;
        this.serviceId = serviceId;
    }
    validateSms() {
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = 'https://www.Paybylink.pl/api/v2/index.php';
            const params = {
                userid: this.userId,
                serviceid: this.serviceId,
                code: this.code,
                number: this.number,
            };
            try {
                const response = yield axios.get(apiUrl, {
                    params,
                    transformResponse: [
                        (data) => JSON.parse(data, (key, value) => key === 'userid' || key === 'serviceid'
                            ? parseInt(value, 10)
                            : value),
                    ],
                });
                return response.data;
            }
            catch (error) {
                console.error('[PAYBYLINK] ', error.message);
                throw error;
            }
        });
    }
}
exports.PaybylinkSms = PaybylinkSms;
