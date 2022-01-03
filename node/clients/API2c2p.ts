import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
const jwt = require('jsonwebtoken');


export default class API2c2p
    extends ExternalClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(`https://sandbox-pgw.2c2p.com/payment/4.1`, context, {
          ...options,
          headers: {},
        });
      }

    public async getPaymentToken(paymentData: any) : Promise<any> {

        const {invoiceNo, description, amount, currencyCode} = paymentData;
        
        // To be fetched securely and remove from here
        const merchantID = "702702000000649"
        const merchantSecretKey = "A04B527A9698F37C9B2747178348DA5C1FBBDC6BFB0DC8B91BEFAD2FE7E45C72"

        const payload = {
            merchantID,
            invoiceNo,
            description,
            amount,
            currencyCode
        }

        const requestJWT = this.generatePayload(payload, merchantSecretKey);

        return this.decodeJWT(await this.http.post(`paymentToken`, requestJWT));

    }
    // implement one more method for payment inquiry

    private async generatePayload(payload: object, merchantSecretKey: string) {
        return jwt.sign(payload, merchantSecretKey);
    }
    private async decodeJWT(responseJWT: any) {
        // write decoding logic
        console.log(responseJWT);
        return responseJWT;
    }
}
