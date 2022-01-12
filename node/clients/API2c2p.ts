import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import jwt = require('jsonwebtoken')
import jose = require('jose')
import crypto = require('crypto')
import xmlBuilder = require('xmlbuilder')
import xmlParser = require('xml2js')
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
        const {merchantID, invoiceNo, settlementURL, amount} = paymentData

        const publicKey2c2p = await jose.importX509(`-----BEGIN CERTIFICATE-----
MIIDLjCCAhYCCQCYGrdwIYmDtzANBgkqhkiG9w0BAQsFADBZMQswCQYDVQQGEwJT
RzELMAkGA1UECAwCU0cxCzAJBgNVBAcMAlNHMRIwEAYDVQQKDAkyQzJQIERlbW8x
DTALBgNVBAsMBDJjMnAxDTALBgNVBAMMBDJjMnAwHhcNMjAxMDI5MDYyNDAzWhcN
MzAxMDI3MDYyNDAzWjBZMQswCQYDVQQGEwJTRzELMAkGA1UECAwCU0cxCzAJBgNV
BAcMAlNHMRIwEAYDVQQKDAkyQzJQIERlbW8xDTALBgNVBAsMBDJjMnAxDTALBgNV
BAMMBDJjMnAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDJuLHNVQSV
L6eZUDR+5D9z0t/gd8fiLKcoNDmPfFS3d1p1KH1VcttTM4KxqC0/jiDs3BqBjUuO
6QQB+vbmV3dQZ/RO3iKgfE3fALBCiDjU6zVp9ZbWQHubyHPLMuHCBS+8EFKgBqCw
I1CTE5x26tskibJYOsExeYornSwGEJkXnXodDsca6sgkcnm8jVNyOYL5HG3KtuFp
AqU9bCfn7QLdCWbJa19exaq1o32UYPSla1Rm15xoByVlP7CxRnReSXCZDF54dUq/
6hw3Jdf1+rIn3rJqkHWXPdX0HMFklieeVXN/GM+8xbkvp9GEXDpvOuO/jgCKZ03z
TKXXpaAumHPVAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAMUh53pskCrDgHVUwgQd
SRr25+o0XPJWW+LmpW68PwFLIrQhgQqys3RHZLPeTpCBQPCd6dClhR41kp7l/uFO
UjhvNcrVhqsEUEClFRu5Fos7votayJgKnvlXnJ+cI3a9cp4Z0W0tLMKus13cb6+h
4kXJ/wCy0IfvUlEXtFOQM+ftjgfbhIopoxvzEzvEulYOhGI/1HKXJ5nRdJRT2unV
oui9OKP1sUHiGqo73EEg5JZeRen/DJvaN8uhwayhyWSC5+NDGK6UKPFIpWKdg+rs
tWK6Vty9jVevX3Y4aNrxiD/IgPYtljGbefEKRAeqEkxc+lWBF70JjpyAobG1Oxaj
jPM=
-----END CERTIFICATE-----`, 'ES256')

        const privateMerchantKey: string = `-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: DES-EDE3-CBC,1F450F5714272C47

UWyVjdjG/WPpVBgoN/6xkaEWOyPhaorweM7roWcK0JK6KpbFgjKzXTeyrd7ZA0RZ
TZhJljETF/+e6Ap4Lj+/3/9dXti4ZqtAZvq4WGwZLr/bJSTob0/4zYK9V0wxGb8r
8nSABRlITCtZqcCVzC1MI41GOEuFFtR1gV8Cz9RKPrmrZrHsW5nF3TgUG/xMcOhv
lzuOpkwNE3KhUfluSgE+eUzb04RBGNBH0XOz2l09hEHnEc/qJX/LHYt72GRU18jy
jTXxZ7PWEjqjFkfpYmdPj1VwNwZv2Mt3stuvXdXbcg1smW7fzkcxzhnB9X/6sMx4
RoEIJPSoLgDV/Tqbqra7mgJFv+PqO6eMfF3l+Xp7VOR8thodRRfpKHPUJDEABP9C
jdWvRkmfEEBdEHQ0MZIAZEo6INwnsy3TejMtdMf5gfKxmxW+cj5/bvXuT3WtbHcM
brwjWF0VONDy7m8XFuqKBLPN8MUbIlp1kbgixITm/bxpx79iOGz0Wq58FxStIJAc
QLtajhKaJDuWSl1e3+sK7lnwU/YL/gMbFmK3CL3bKPdHWOM5+PHh5lyHtq95EgBF
VbJy8sYneqizCnuHtIHbEfrkeAVN6l+47okvZ4noKu8czaxzwwV/JKD+yUjRmcHq
IDLTJrelA0RD8PK6uMQDIL4iP4hRgO/00emjWQEgGRN6oAS4dKscu4YGFR+xVH06
fuGPLjyq3ww+dwN2S6YQzbTMurqK88fTawPCG9zZVIlV73AIa8LihqiHtTs880fa
ufmuwINBmrFPbiYN6g6F+Ucp++8pHhYclTr90ALJNJgsnMqw0nIPmbSXq8U5dKlY
Vc05fluk7E25vPW6Wwt3RPVglVBPYrcAzSEaD6cCbIppjgtqCnDARYlgEQJKSV1e
JbmOGaHucWOgbSdu3tWql6tix8NhSmUQr//ZSG3W5f186UJD0rP+Gp0oGxJHEfR7
yjf+3+EMKyC0pwnKSuomDSN+1ORDfOGMJWUKKmZ3KkA6d+A6uOkSsQ64tQspbUTD
48aA7aUm0bWDP63wlnGrspYKbG42IkwS1stzS6RwWXDiqD1lXUinq2YBEHHHKU3N
ijL9CnjSqTopbFh6/myEEM3I4HC/UVEMRFsn/ozyfdZxToiJCcZudZm67RYC8UVi
LdQj44MF197OPOhiRZGQ1x+BTXUODGF7musypkhp/yOHlHVCQ4yyb9q1CDGR+pp8
TX0XXdG34PuRBMj08R/0jyYqKL7qcTjqE2TOq+Q5/Puy1oz/gzpBRm/AlWqTnEZM
ZbrTbMZfeeyfS2qXA9wK4Iw0lzJ5dlhCRMRciuxZ+OF9V5gjUpWlQ3FqfgLtlmfq
NxzEnjZcWaJidHMtO2f9FxLTsh0DWFRMwypy4g3rYWgXr8duuY4/bmrV4Rh0ojGX
ELYIBdFLkxN5PrRPY4dmzEPwcCo++dk7TggAAQUEEifkKJNJe9KTbLtmaJFGQ4Ng
bINRvq8yAuAD8dtry76a3hAcKQI/HRS9c5v28Oh6G5UBJ3KzYhLgBMiG52DcUTgA
ugasgUiIZ5N48ttYtuMa1nmUvnP4t7XWwCmeUQ2hix13AAVQz9q9yPG6WFHiW20n
-----END RSA PRIVATE KEY-----`

        const cryptoPrivateMerchantKey = await crypto.createPrivateKey({
            key: privateMerchantKey,
            type: 'pkcs1',
            passphrase: 'kasasg'
        })

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
                },
                actionAmount: {
                    '#text': amount
                }
            }
        }

        const xmlPayload = xmlBuilder.create(payload).end({ pretty: true })

        const joseEncryptedPayload = await new jose.CompactEncrypt(new TextEncoder().encode(xmlPayload)).setProtectedHeader({ alg: 'RSA-OAEP', enc: 'A256GCM' }).encrypt(publicKey2c2p)
        const signedJWT = await jwt.sign(joseEncryptedPayload, cryptoPrivateMerchantKey.export({type: 'pkcs1', format: 'pem'}), { algorithm: 'PS256'})

        const requestResponse: any = await this.http.post(`${settlementURL}`, signedJWT)
        const decodedResponseJWT: any = jwt.decode(requestResponse)
        const { plaintext } = await jose.compactDecrypt(decodedResponseJWT, cryptoPrivateMerchantKey)
        return xmlParser.parseString(new TextDecoder().decode(plaintext), function (err: any, result: any) {
            if(err) {
                console.log(err)
            } else {
                console.log(result);
                return result
            }
        });
    }

}
