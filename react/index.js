import { useState, useEffect } from 'react'
import styles from './paymentForm2c2p.css'

import Modal from 'react-modal'
const axios = require('axios')

const PaymentApp2c2p = props => {
  const [showModal, setShowModal] = useState(true)
  const [appPayload, setAppPayload] = useState(JSON.parse(props.appPayload))

  useEffect(() => {
    $(window).trigger('removePaymentLoading.vtex')
    window.addEventListener('message', async message => {
      if (
        message.origin.indexOf('2c2p') > -1 &&
        message.data.paymentResult.respCode != '2000' &&
        message.data.paymentResult.respCode != '1001'
      ) {
        setShowModal(false)
        await changeStatus('denied', false)
        $(window).trigger('transactionValidation.vtex', [false])
      } else if (
        message.origin.indexOf('2c2p') > -1 &&
        message.data.paymentResult &&
        message.data.paymentResult.respCode == '2000'
      ) {
        setShowModal(false)
        await changeStatus('approved', true)
        $(window).trigger('transactionValidation.vtex', [true])
      }
    })
  }, [])

  const changeStatus = async (status, authorizationComplete) => {
    const inboundAPI = axios.create({
      timeout: 30000,
    })
    await inboundAPI.post('/_v/kasasg.connector2c2p/v0/changeStatus', {
      paymentId: appPayload.paymentId,
      status: status,
      callbackUrl: appPayload.callbackUrl,
      paymentToken: appPayload.paymentObject.paymentToken.response.paymentToken,
      amount: appPayload.paymentObject.amount,
      invoiceNo: appPayload.paymentObject.invoiceNo,
      authorizationComplete: authorizationComplete,
    })
  }

  return (
    <div>
      {appPayload.paymentObject.paymentToken.success ? (
        <Modal
          ariaHideApp={false}
          style={{
            overlay: {
              zIndex: 99,
            },
          }}
          isOpen={showModal}
          contentLabel="Payment Form"
          className={styles.modalContent}
        >
          <iframe
            title="2c2p"
            src={appPayload.paymentObject.paymentToken.response.webPaymentUrl}
            className={styles.iframe}
          />
        </Modal>
      ) : (
        <p>Please add more products to the cart</p>
      )}
    </div>
  )
}

export default PaymentApp2c2p
