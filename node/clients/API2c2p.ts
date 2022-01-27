import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import jwt = require('jsonwebtoken')
export default class API2c2p
    extends ExternalClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(``, context, {
          ...options,
          headers: {},
        });
      }

    public async getPaymentToken(paymentData: any) : Promise<any> {

        const {invoiceNo, description, amount, currencyCode, merchantID, merchantSecretKey, baseURL} = paymentData;

        const payload = {
            "merchantID": merchantID,
            "invoiceNo": invoiceNo,
            "description": description,
            "amount": amount,
            "currencyCode": currencyCode
        }

        const requestResponse: any = await this.http.post(`${baseURL}/paymentToken`, {"payload": await jwt.sign(payload, merchantSecretKey)})

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

        const {paymentToken, merchantID, invoiceNo, locale, merchantSecretKey, baseURL} = paymentData;
        let requestResponse: any

        const payload = {
            "paymentToken": paymentToken,
            "merchantID": merchantID,
            "invoiceNo": invoiceNo,
            "locale": locale
        }

        try {
            requestResponse = await this.http.post(`${baseURL}/paymentInquiry`, {"payload": await jwt.sign(payload, merchantSecretKey)})
        } catch(e) {
            return  {
                response: {
                    respCode: '0999' 
                }
            }
        }

        if(!!requestResponse.payload) {
            return {
                response: jwt.decode(requestResponse.payload)
            }
        } else {
            return {
                response: {
                    respCode: '0999' 
                }
            }
        }
    }
}
