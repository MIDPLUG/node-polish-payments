const axios = require('axios');
const crypto = require('crypto');

export class PaybylinkSms {
  private userId: string; // Required
  private serviceId: string; // Required
  public code = ''; // Required
  public number = ''; // Required

  constructor(userId: string, serviceId: string) {
    this.userId = userId;
    this.serviceId = serviceId;
  }

  async validateSms(): Promise<any> {
    const apiUrl = 'https://www.Paybylink.pl/api/v2/index.php';

    const params = {
      userid: this.userId,
      serviceid: this.serviceId,
      code: this.code,
      number: this.number,
    };

    try {
      const response = await axios.get(apiUrl, {
        params,
        transformResponse: [
          (data: string) =>
            JSON.parse(data, (key, value) =>
              key === 'userid' || key === 'serviceid'
                ? parseInt(value, 10)
                : value
            ),
        ],
      });

      return response.data;
    } catch (error: any) {
      console.error('[PAYBYLINK] ', error.message);
      throw error;
    }
  }
}
