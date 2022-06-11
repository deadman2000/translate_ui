import {Api} from "./Api";
import type {ICommentNotify} from "@/model/ICommentNotify";

const baseUrl = '/notify'

export class NotifyApi {
    constructor(api: Api) {
        this.api = api
    }

    list(): Promise<ICommentNotify[]> {
        return this.api.get(baseUrl)
    }

    markRead(): Promise {
        return this.api.post(`${baseUrl}/read`)
    }
}