export declare class PaybylinkTransfer {
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
    createTransfer(): Promise<any>;
}
