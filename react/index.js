import React, { Component } from 'react'
import styles from './index.css'

import Modal from 'react-modal'
const axios = require('axios')

class PaymentApp2c2p extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      showModal: true,
      text: 'Payment App Integration',
      appPayload: JSON.parse(props.appPayload),
    }
    console.log('DATA: ', JSON.parse(props.appPayload))
  }

  componentDidMount() {
    $(window).trigger('removePaymentLoading.vtex')

    window.addEventListener('message', async (data) => {
      if (!data.paymentResult && data.origin.indexOf('2c2p') > -1) {
        this.setState({ showModal: false })
        // await this.changeStatus('denied');
        $(window).trigger('transactionValidation.vtex')
      }
      console.log('Message Event Called', data)
    })
  }

  // changeStatus = async (status) => {
  //   const inboundAPI = axios.create({
  //     timeout: 5000,
  //   })
  //   const response = await inboundAPI.post(
  //     '/_v/kasasg.connector2c2p/v0/changeStatus',
  //     {
  //       paymentId,
  //       status: status,
  //       callbackUrl,
  //     }
  //   )
  // }

  // respondTransaction = status => {
  //   $(window).trigger('transactionValidation.vtex', [status])
  // }

  // cancelTransaction = async () => {
  //   const { paymentId, callbackUrl } = JSON.parse(this.props.appPayload)
  //   this.setState({ loading: true })
  //   const inboundAPI = axios.create({
  //     timeout: 5000,
  //   })

  //   try {
  //     const response = await inboundAPI.post('/_v/partnerintegrationbra.payment-provider/v0/changeStatus',
  //       {
  //         paymentId,
  //         status: "denied",
  //         callbackUrl
  //       });
  //     console.log(response.data)
  //     this.setState({ text: response.data.text, loading: false })
  //     this.respondTransaction(false)
  //   }
  //   catch (err) {
  //     this.setState({ text: "Erro", loading: false })
  //   }

  //   // fetch(parsedPayload.denyPaymentUrl).then(() => {
  //   // })
  // }

  // confirmTransaction = async () => {
  //   const { paymentId, callbackUrl } = JSON.parse(this.props.appPayload)
  //   this.setState({ loading: true })
  //   const inboundAPI = axios.create({
  //     timeout: 5000,
  //   })
  //   try {
  //     const response = await inboundAPI.post('/_v/partnerintegrationbra.payment-provider/v0/changeStatus',
  //       {
  //         paymentId,
  //         status: "approved",
  //         callbackUrl
  //       });
  //     console.log(response.data)
  //     this.setState({ text: response.data.text, loading: false })
  //     this.respondTransaction(true)
  //   }
  //   catch (err) {
  //     this.setState({ text: "Erro", loading: false })
  //   }

  //   // fetch(parsedPayload.denyPaymentUrl).then(() => {
  //   // })
  // }

  render() {
    const { paymentToken } = this.state.appPayload.paymentObject
    return (
      <div>
        {/* Render the iFrame only if the value is greater than 500 */}
        {paymentToken.success ? (
          <Modal
            style={{
              overlay: {
                zIndex: 99,
              },
            }}
            isOpen={this.state.showModal}
            contentLabel="Example Modal"
          >
            <iframe
              title="2c2p"
              src={paymentToken.response.webPaymentUrl}
              className={styles.iframe}
            />
          </Modal>
        ) : (
          <p>Please add more products to the cart</p>
        )}
      </div>
    )
  }
}

export default PaymentApp2c2p
