import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import jwt = require('jsonwebtoken')
import xmlBuilder = require('xmlbuilder')
// import xmlParser = require('xml2js')
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

        const payload = {
            "paymentToken": paymentToken,
            "merchantID": merchantID,
            "invoiceNo": invoiceNo,
            "locale": locale
        }

        const requestResponse: any = await this.http.post(`${baseURL}/paymentInquiry`, {"payload": await jwt.sign(payload, merchantSecretKey)})

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

    public async getSettlementResponse(paymentData: any) : Promise<any> {
        console.log("SETTLING API")
        const {merchantID, invoiceNo, merchantSecretKey, settlementURL} = paymentData

        const payload = {
            PaymentProcessRequest: {
                version: {
                    '#text': 3.8
                },
                merchantID: {
                    '#text': merchantID
                },
                processType: {
                    '#text': 'S'
                },
                invoiceNo: {
                    '#text': invoiceNo
                }
            }
        }

        const xmlPayload = xmlBuilder.create(payload).end({ pretty: true})
        console.log("xmlPayload--------------",xmlPayload)

        const requestResponse: any = await this.http.post(`${settlementURL}`, await jwt.sign(payload, merchantSecretKey))
        console.log(requestResponse)
        // return xmlParser.parseString(jwt.decode(requestResponse), function (err: any, result: any) {
        //     console.dir(result);
        //     return result
        // });
    }

}
