export declare class PaybylinkSms {
    private userId;
    private serviceId;
    code: string;
    number: string;
    constructor(userId: string, serviceId: string);
    validateSms(): Promise<any>;
}
