import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import jwt = require('jsonwebtoken')


export default class API2c2p
    extends ExternalClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(`https://sandbox-pgw.2c2p.com/payment/4.1`, context, {
          ...options,
          headers: {},
        });
      }

    public async getPaymentToken(paymentData: any) : Promise<any> {

        const {invoiceNo, description, amount, currencyCode, merchantID, merchantSecretKey} = paymentData;

        const payload = {
            "merchantID": merchantID,
            "invoiceNo": invoiceNo,
            "description": description,
            "amount": amount,
            "currencyCode": currencyCode
        }

        const requestResponse: any = await this.http.post(`/paymentToken`, {"payload": await jwt.sign(payload, merchantSecretKey)})

        if(!!requestResponse.payload) {
            return {
                "success": true,
                "response": jwt.decode(requestResponse.payload)
            }
        } else {
            return {
                "success": false
            }
        }
    }

    public async getPaymentStatus(paymentData: any) : Promise<any> {

        const {paymentToken, merchantID, invoiceNo, locale, merchantSecretKey} = paymentData;

        const payload = {
            "paymentToken": paymentToken,
            "merchantID": merchantID,
            "invoiceNo": invoiceNo,
            "locale": locale
        }

        const requestResponse: any = await this.http.post(`/paymentInquiry`, {"payload": await jwt.sign(payload, merchantSecretKey)})

        if(!!requestResponse.payload) {
            return {
                "success": true,
                "response": jwt.decode(requestResponse.payload)
            }
        } else {
            return {
                "success": false
            }
        }
    }

}
