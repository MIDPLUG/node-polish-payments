export declare class PaybylinkGenerateTransferSignature {
    private secretKey;
    private shopId;
    price: number;
    control: string;
    description: string;
    email: string;
    notifyURL: string;
    returnUrlSuccess: string;
    returnUrlSuccessTidPass: boolean;
    constructor(secretKey: string, shopId: number);
    generateSignature(): string;
}
