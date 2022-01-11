import {
  AuthorizationRequest,
  AuthorizationResponse,
  CancellationRequest,
  CancellationResponse,
  Cancellations,
  InboundRequest,
  InboundResponse,
  PaymentProvider,
  RefundRequest,
  RefundResponse,
  Refunds,
  SettlementRequest,
  SettlementResponse,
  Settlements,
} from '@vtex/payment-provider'
import { Clients } from './clients'
//import { randomString } from './utils'
import { executeAuthorization } from './flow'

export default class Connector2c2p extends PaymentProvider<Clients> {
  public async authorize(
    authorization: AuthorizationRequest
  ): Promise<AuthorizationResponse> {
    const paymentIdResponse = await this.context.clients.payment2c2pid.get(
      authorization.paymentId,
      ['_all']
    )

    if (!paymentIdResponse) {
      const paymentToken = await this.context.clients.api2c2p.getPaymentToken({
        invoiceNo: authorization.orderId,
        description: authorization.orderId,
        amount: authorization.value,
        currencyCode: 'SGD',
        merchantID: authorization?.merchantSettings?.[0]?.value ?? '',
        merchantSecretKey: authorization?.merchantSettings?.[1]?.value ?? '',
        baseURL:
          authorization?.merchantSettings?.[2]?.value ??
          'https://sandbox-pgw.2c2p.com/payment/4.1',
      })

      let payment2c2pid = {
        id: authorization.paymentId,
        paymentId: authorization.paymentId,
        paymentToken: paymentToken.response.paymentToken,
        amount: authorization.value.toString(),
        invoiceNo: authorization.orderId,
        status: 'undefined',
        authorizationComplete: false,
      }

      await this.context.clients.payment2c2pid.saveOrUpdate(payment2c2pid)

      payment2c2pid.paymentToken = paymentToken

      return executeAuthorization(authorization, payment2c2pid, response =>
        this.callback(authorization, response)
      )
    }

    const paymentStatusObject = paymentIdResponse.authorizationComplete
      ? await this.context.clients.api2c2p.getPaymentStatus({
          paymentToken: paymentIdResponse.paymentToken,
          merchantID: authorization?.merchantSettings?.[0]?.value ?? '',
          invoiceNo: paymentIdResponse.invoiceNo,
          locale: 'en',
          merchantSecretKey: authorization?.merchantSettings?.[1]?.value ?? '',
          baseURL:
            authorization?.merchantSettings?.[2]?.value ??
            'https://sandbox-pgw.2c2p.com/payment/4.1',
        })
      : { respCode: 'fail' }

    if (paymentStatusObject.response.respCode === '0000') {
      return {
        paymentId: paymentIdResponse.paymentId,
        paymentUrl: '',
        authorizationId: '',
        status: 'approved',
        acquirer: 'null',
        code: 'null',
        message: 'null',
        identificationNumber: undefined,
        identificationNumberFormatted: undefined,
        barCodeImageNumber: undefined,
        barCodeImageType: undefined,
        delayToCancel: 600,
        tid: paymentIdResponse.paymentId, //check and edit later
        nsu: paymentIdResponse.paymentId, //check and edit later
      }
    } else {
      return {
        paymentId: paymentIdResponse.paymentId,
        paymentUrl: '',
        authorizationId: '',
        status: 'denied', //check and edit later
        acquirer: 'null',
        code: 'null',
        message: 'null',
        identificationNumber: undefined,
        identificationNumberFormatted: undefined,
        barCodeImageNumber: undefined,
        barCodeImageType: undefined,
        delayToCancel: 600,
        tid: paymentIdResponse.paymentId, //check and edit later
        nsu: paymentIdResponse.paymentId, //check and edit later
      }
    }
  }

  public async cancel(
    cancellation: CancellationRequest
  ): Promise<CancellationResponse> {
    return Cancellations.deny(cancellation, {
      code: '123',
      message: 'Deu não',
    })
  }

  public async refund(refund: RefundRequest): Promise<RefundResponse> {
    return Refunds.approve(refund, { refundId: '12344' })
  }

  public async settle(
    settlement: SettlementRequest
  ): Promise<SettlementResponse> {
    console.log("SETTLING")
    const paymentIdResponse = await this.context.clients.payment2c2pid.get(
      settlement.paymentId,
      ['_all']
    )
    const settlementResponse = await this.context.clients.api2c2p.getSettlementResponse(
      {
        invoiceNo: paymentIdResponse?.invoiceNo,
        merchantID: settlement?.merchantSettings?.[0]?.value ?? '',
        merchantSecretKey: settlement?.merchantSettings?.[1]?.value ?? '',
        settlementURL:
          settlement?.merchantSettings?.[3]?.value ??
          'https://demo2.2c2p.com/2C2PFrontend/PaymentAction/2.0/action',
      }
    )
    return Settlements.approve(settlement, { settleId: settlementResponse.referenceNo })
  }

  public inbound(inbound: InboundRequest): Promise<InboundResponse> {
    const response = async () => {
      return {
        paymentId: inbound.paymentId,
        code: '200',
        message: 'teste',
        responseData: {
          statusCode: 200,
          contentType: 'Application/JSON',
          content: JSON.stringify({
            ...JSON.parse(inbound.requestData.body),
            appKey: this.apiKey,
            appToken: this.appToken,
          }),
        },
        requestId: '1234',
      }
    }

    return response()
  }
}
