import { IOClients } from '@vtex/api'
import { masterDataFor } from '@vtex/clients'

import API2c2p from './API2c2p'

export interface Payment2c2pIds {
    id: string
    paymentId: string
    paymentToken: string
    amount: string
    invoiceNo: string
    status: string
  }

export class Clients extends IOClients {

    public get external() {
        return this.getOrSet('api2c2p', API2c2p)
      }

    public get paymentIdRepository() {
        return this.getOrSet(
          'paymentIdRepository',
          masterDataFor<Payment2c2pIds>('paymentid')
        )
      }

}