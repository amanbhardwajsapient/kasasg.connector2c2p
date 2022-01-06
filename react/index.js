import React, { Component } from 'react'
import styles from './index.css'

import Modal from 'react-modal'
// const axios = require('axios');

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
    console.log('Worked')
    $(window).trigger('removePaymentLoading.vtex')

    // Event listener to close the Modal
    window.addEventListener('message', data => {
      console.log('Message Event Called', data)
      // $(window).trigger('transactionValidation.vtex', [false])
    })
  }

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

  // inboundRequest = async () => {
  //   const parsedPayload = JSON.parse(this.props.appPayload)
  //   this.setState({ loading: true })

  //   const inboundAPI = axios.create({
  //     //baseURL: body.inboundRequestsUrl.split('/:')[0],
  //     timeout: 5000,
  //   })
  //   try {
  //     const response = await inboundAPI.post('/_v/partnerintegrationbra.payment-provider/v0/paymentapp',
  //       {
  //         inboundRequestsUrl: parsedPayload.inboundRequestsUrl
  //       });
  //     console.log(response.data)
  //     this.setState({ text: response.data.text, appKey: response.data.appKey, appToken: response.data.appToken, loading: false })
  //   }
  //   catch (err) {
  //     this.setState({ text: "Erro", loading: false })
  //   }
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
