import {Api} from "./Api";
import type {IInvite} from "@/model/IInvite";

const baseUrl = '/invites'

export type IActivateRequest = {
    code: string,
    login: string,
    password: string
}

export class InvitesApi {
    constructor(api: Api) {
        this.api = api
    }

    list(): Promise<IInvite[]> {
        return this.api.get(baseUrl)
    }

    create(): Promise<IInvite> {
        return this.api.post(baseUrl)
    }

    delete(id: string): Promise {
        return this.api.delete(`${baseUrl}/${id}`)
    }

    isValid(code: string): Promise<boolean> {
        return this.api.get(`${baseUrl}/valid/${code}`)
    }

    activate(request: IActivateRequest) {
        return this.api.post(`${baseUrl}/activate`, request)
    }
}
