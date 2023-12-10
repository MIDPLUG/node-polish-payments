const axios = require('axios');

export class PaybylinkSms {
  private userId: number;
  private serviceId: number;
  public code: string;
  public number: number;

  constructor(userId: number, serviceId: number) {
    this.userId = userId;
    this.serviceId = serviceId;
    this.code = '';
    this.number = 0;
  }

  async checkCode(): Promise<any> {
    const apiUrl = 'https://www.Paybylink.pl/api/v2/index.php';

    const params = {
      userid: this.userId,
      serviceid: this.serviceId,
      code: this.code,
      number: this.number,
    };

    try {
      const response = await axios.get(apiUrl, { params });

      return response.data;
    } catch (error) {
      console.error('[PAYBYLINK] | ERROR: ', error);
      throw error;
    }
  }
}
