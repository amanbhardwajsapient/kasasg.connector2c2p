import { IOClients } from '@vtex/api'
import { masterDataFor } from '@vtex/clients'

import API2c2p from './API2c2p'
import External from './External'

export interface Payment2c2pIds {
    id: string
    paymentId: string
    paymentToken: object
    amount: string
    invoiceNo: string
    status: string
  }

export class Clients extends IOClients {

    public get api2c2p() {
        return this.getOrSet('api2c2p', API2c2p)
      }

    public get external() {
        return this.getOrSet('external', External)
      }

    public get payment2c2pid() {
        return this.getOrSet(
          'payment2c2pid',
          masterDataFor<Payment2c2pIds>('payment2c2pid')
        )
      }
}