const axios = require('axios');
const crypto = require('crypto');

interface PaysafecardOptions {
  userid: number;
  shopid: number;
  pin: string;
  amount: number;
  return_ok: string;
  return_fail: string;
  url: string;
  control: string;
  description?: string;
  get_pid?: boolean;
}

export class PaybylinkPaysafecard {
  private apiUrl: string;
  public options: PaysafecardOptions;

  constructor(userid: number, shopid: number, pin: string) {
    this.apiUrl = 'https://paybylink.pl/api/psc/index.php';
    this.options = {
      userid,
      shopid,
      pin,
      amount: 0,
      return_ok: '',
      return_fail: '',
      url: '',
      control: '',
    };
  }

  async generatePayment(): Promise<any> {
    const {
      userid,
      shopid,
      amount,
      return_ok,
      return_fail,
      url,
      control,
      description,
      get_pid,
      pin,
    } = this.options;

    const signatureData = [
      userid.toString(),
      shopid.toString(),
      amount.toString(),
      return_ok,
      return_fail,
      url,
      control,
      description || '',
      get_pid ? '1' : '',
    ];

    const filteredSignatureData = signatureData.filter(field => field !== '');

    const signatureString = filteredSignatureData.join('|');
    const hash = crypto
      .createHash('sha256')
      .update(signatureString + pin)
      .digest('hex');

    try {
      const response = await axios.post(this.apiUrl, {
        userid,
        shopid,
        amount,
        return_ok,
        return_fail,
        url,
        control,
        description,
        get_pid,
        hash,
      });

      return response.data;
    } catch (error) {
      console.error('[PAYBYLINK] | ERROR:', error);
      throw error;
    }
  }
}
