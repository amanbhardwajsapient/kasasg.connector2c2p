import {
  AuthorizationRequest,
  AuthorizationResponse,
  CancellationRequest,
  CancellationResponse,
  Cancellations,
  PaymentProvider,
  RefundRequest,
  RefundResponse,
  Refunds,
  SettlementRequest,
  SettlementResponse,
  Settlements,
} from '@vtex/payment-provider'

import { randomString } from './utils'
import { executeAuthorization } from './flow'

export default class TestSuiteApprover extends PaymentProvider {
  // This class needs modifications to pass the test suit.
  // Refer to https://help.vtex.com/en/tutorial/payment-provider-protocol#4-testing
  // in order to learn about the protocol and make the according changes.

  public async authorize(
    authorization: AuthorizationRequest
  ): Promise<AuthorizationResponse> {
      return executeAuthorization(authorization, response =>
        this.callback(authorization, response)
      )
  }

  public async cancel(
    cancellation: CancellationRequest
  ): Promise<CancellationResponse> {
      return Cancellations.approve(cancellation, {
        cancellationId: randomString(),
      })
  }

  public async refund(refund: RefundRequest): Promise<RefundResponse> {
      return Refunds.deny(refund)
  }

  public async settle(
    settlement: SettlementRequest
  ): Promise<SettlementResponse> {

      return Settlements.approve(settlement,{settleId:"123456"})
  }

  public inbound: undefined
}