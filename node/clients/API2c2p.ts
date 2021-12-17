import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'


export default class API2c2p
    extends ExternalClient {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(context: IOContext, options?: InstanceOptions) {
        super(``, context, options)
    }

    public async sendPost(
        url: string,
        body: Object)
        : Promise<any> {

        return this.http.post(`${url}`, body)

    }
}

// TO EDIT