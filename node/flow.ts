import {
  AuthorizationRequest,
  AuthorizationResponse,
} from '@vtex/payment-provider'

import { randomString } from './utils'

type Flow =
  | 'PaymentApp'

export const flows: Record<
  Flow,
  (
    authorization: AuthorizationRequest,
    paymentObject: Object,
    callback: (response: AuthorizationResponse) => void
  ) => AuthorizationResponse
> = {
  PaymentApp: (request, paymentObject) => {

    const { paymentId, inboundRequestsUrl, callbackUrl, transactionId } = request

    return {
      paymentId,
      paymentUrl: null,
      authorizationId: '1234',
      status: 'undefined',
      acquirer: null,
      code: null,
      message: null,
      paymentAppData: {
        appName: 'kasasg.connector2c2p',
        payload: JSON.stringify({ inboundRequestsUrl, callbackUrl, paymentId, transactionId, paymentObject }),
      },
      identificationNumber: undefined,
      identificationNumberFormatted: undefined,
      barCodeImageNumber: undefined,
      barCodeImageType: undefined,
      delayToCancel: 600,
      tid: randomString(),
      nsu: randomString()
    }
  },
}

export const executeAuthorization = (
  request: AuthorizationRequest,
  paymentObject: Object,
  callback: (response: AuthorizationResponse) => void
): AuthorizationResponse => {
  
  return flows['PaymentApp'](request, paymentObject, callback)
}
