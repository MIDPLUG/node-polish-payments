const axios = require('axios');
const crypto = require('crypto');

interface TransferOptions {
  price: number;
  control?: string;
  description?: string;
  email?: string;
  notifyURL?: string;
  returnUrlSuccess?: string;
  returnUrlSuccessTidPass?: boolean;
  hideReceiver?: boolean;
  customFinishNote?: string;
}

export class PaybylinkTransfer {
  private shopId: number;
  private secretKey: string;
  public options: TransferOptions;

  constructor(secretKey: string, shopId: number) {
    this.shopId = shopId;
    this.secretKey = secretKey;
    this.options = {
      price: 0,
    };
  }

  async createTransfer(): Promise<any> {
    const {
      price,
      control = '',
      description = '',
      email = '',
      notifyURL = '',
      returnUrlSuccess = '',
      returnUrlSuccessTidPass = false,
      hideReceiver = false,
      customFinishNote = '',
    } = this.options;

    const signature = new PaybylinkGenerateTransferSignature(
      this.secretKey,
      this.shopId
    ).generate({
      price,
      control,
      description,
      email,
      notifyURL,
      returnUrlSuccess,
      returnUrlSuccessTidPass,
      hideReceiver,
      customFinishNote,
    });

    const apiUrl = 'https://www.Paybylink.pl/api/v2/index.php';

    const requestData = {
      shopId: this.shopId,
      price,
      control,
      description,
      email,
      notifyURL,
      returnUrlSuccess,
      returnUrlSuccessTidPass,
      hideReceiver,
      customFinishNote,
      signature,
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('[PAYBYLINK] | ERROR:', error);
      throw error;
    }
  }
}

export class PaybylinkGenerateTransferSignature {
  private secretKey: string;
  private shopId: number;

  constructor(secretKey: string, shopId: number) {
    this.secretKey = secretKey;
    this.shopId = shopId;
  }

  generate(data: TransferOptions): string {
    const {
      price,
      control = '',
      description = '',
      email = '',
      notifyURL = '',
      returnUrlSuccess = '',
      returnUrlSuccessTidPass = false,
      hideReceiver = false,
      customFinishNote = '',
    } = data;

    const signatureData = [
      this.secretKey,
      this.shopId.toString(),
      price.toString(),
      control,
      description,
      email,
      notifyURL,
      returnUrlSuccess,
      hideReceiver.toString(),
      customFinishNote,
    ];

    const filteredSignatureData = signatureData.filter(field => field !== '');

    const signatureString = filteredSignatureData.join('|');

    return crypto.createHash('sha256').update(signatureString).digest('hex');
  }
}
