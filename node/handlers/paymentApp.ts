import { json } from 'co-body'

export async function changeStatus(ctx: Context) {
  const body: {
    callbackUrl: string
    paymentId: string
    paymentToken: string
    amount: string
    invoiceNo: string
    status: string
    authorizationComplete: boolean
  } = await json(ctx.req)

  const request = {
    paymentId: body.paymentId,
    paymentToken: body.paymentToken,
    amount: body.amount,
    invoiceNo: body.invoiceNo,
    status: body.status,
    authorizationComplete: body.authorizationComplete
  }

  const updated = await ctx.clients.payment2c2pid.saveOrUpdate({
    id: body.paymentId,
    status: body.status,
    paymentToken: body.paymentToken,
    amount: body.amount,
    invoiceNo: body.invoiceNo,
    paymentId: body.paymentId,
    authorizationComplete: body.authorizationComplete
  })

  console.log(updated)

  if (updated) {
    const response = await ctx.clients.external.sendPost(
      body.callbackUrl,
      request
    )

    ctx.status = 200
    ctx.body = response
  } else {
    ctx.status = 400
    ctx.body = { message: 'Error' }
  }
}
