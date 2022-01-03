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
    const paymentIdResponse = await this.context.clients.paymentIdRepository.get(authorization.paymentId,["_all"])

    console.log("-------------------------- AUTHORIZE REQUEST", paymentIdResponse)

    if(!paymentIdResponse){
      const paymentToken = await this.context.clients.api2c2p.getPaymentToken({invoiceNo: authorization.orderId, description: authorization.orderId, amount: authorization.value, currencyCode: "SGD"})

      this.context.clients.paymentIdRepository.saveOrUpdate({
        id: authorization.paymentId,
        paymentId: authorization.paymentId,
        paymentToken: paymentToken,
        amount: authorization.value.toString(),
        invoiceNo: authorization.orderId,
        status: "undefined"
       })

      return executeAuthorization(authorization, response =>
        this.callback(authorization, response)
      )
    }

    return executeAuthorization(authorization, response =>
      this.callback(authorization, response),
      paymentIdResponse.status
    )
    
  }

  public async cancel(
    cancellation: CancellationRequest
  ): Promise<CancellationResponse> {
    return Cancellations.deny(cancellation, {
      code:"123",
      message: "Deu não"
    })
  }

  public async refund(refund: RefundRequest): Promise<RefundResponse> {
    return Refunds.approve(refund, {refundId: "12344"})
  }

  public async settle(
    settlement: SettlementRequest
  ): Promise<SettlementResponse> {
    return Settlements.approve(settlement, { settleId: '123456'})
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
