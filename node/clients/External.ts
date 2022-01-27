import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'


export default class External
    extends ExternalClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(``, context, {
          ...options,
          headers: {},
        });
      }

    public async sendPost(url: string, body: Object): Promise<any> {
        try {
            return this.http.post(`${url}`, body)
        } catch {
            return {
                success: false
            }
        }
    }
}