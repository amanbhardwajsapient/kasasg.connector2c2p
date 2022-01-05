import React, { Component } from 'react'
import styles from './index.css'
// const axios = require('axios');
class PaymentApp2c2p extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      text: "Payment App Integration",
      appKey: null,
      appToken: null
    }
    console.log("FRONTEND APP RENDERED")
  }

  // console.log("FRONTEND APP RENDERED")

  // componentWillMount = () => {
  //   // this.injectScript(
  //   //   'google-recaptcha-v2',
  //   //   'https://recaptcha.net/recaptcha/api.js?render=explicit',
  //   //   this.handleOnLoad
  //   // )
  // }

  componentDidMount() {
    console.log("Worked")
    $(window).trigger('removePaymentLoading.vtex')
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
    // const { loading, text, appKey, appToken } = this.state

    return (
      <div>
        WORKED
      </div>
    )
  }
}

export default PaymentApp2c2p
