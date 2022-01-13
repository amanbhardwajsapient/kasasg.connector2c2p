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
        currencyCode: authorization?.merchantSettings?.[4]?.value ?? 'SGD',
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
          locale: authorization?.merchantSettings?.[3]?.value ?? 'en',
          merchantSecretKey: authorization?.merchantSettings?.[1]?.value ?? '',
          baseURL:
            authorization?.merchantSettings?.[2]?.value ??
            'https://sandbox-pgw.2c2p.com/payment/4.1',
        })
      : { response: { respCode: 'fail' } }

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
        tid: '',
        nsu: undefined,
      }
    } else if (
      paymentStatusObject.response.respCode === '0001' ||
      paymentStatusObject.response.respCode === '2001' ||
      paymentStatusObject.response.respCode === '2003'
    ) {
      return {
        paymentId: paymentIdResponse.paymentId,
        paymentUrl: '',
        authorizationId: '',
        status: 'undefined',
        acquirer: 'null',
        code: 'null',
        message: 'null',
        identificationNumber: paymentIdResponse.paymentToken,
        identificationNumberFormatted: undefined,
        barCodeImageNumber: undefined,
        barCodeImageType: undefined,
        delayToCancel: 600,
        tid: '',
        nsu: undefined,
      }
    } else {
      return {
        paymentId: paymentIdResponse.paymentId,
        paymentUrl: '',
        authorizationId: '',
        status: 'denied',
        acquirer: 'null',
        code: 'null',
        message: 'null',
        identificationNumber: paymentIdResponse.paymentToken,
        identificationNumberFormatted: undefined,
        barCodeImageNumber: undefined,
        barCodeImageType: undefined,
        delayToCancel: 600,
        tid: '',
        nsu: undefined,
      }
    }
  }

  public async cancel(
    cancellation: CancellationRequest
  ): Promise<CancellationResponse> {
    return Cancellations.deny(cancellation, {
      code: cancellation.paymentId,
      message:
        'Payment cancelled due to incomplete payment or manual cancellation.',
    })
  }

  public async refund(refund: RefundRequest): Promise<RefundResponse> {
    return Refunds.deny(refund, { message: 'Refund not implemented' })
  }

  public async settle(
    settlement: SettlementRequest
  ): Promise<SettlementResponse> {
    return Settlements.approve(settlement, {
      settleId: settlement.paymentId,
    })
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
