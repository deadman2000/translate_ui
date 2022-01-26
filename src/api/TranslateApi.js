import {Api} from "@/api/Api";
import type {ITranslateInfo} from "@/model/ITranslateInfo";

export type ITranslateRequest = {
    project: string,
    volume: string,
    number: number,
    translateId: string,
    text: string
}

const baseUrl = '/translate'

export class TranslateApi {
    constructor(api: Api) {
        this.api = api
    }

    submit(request: ITranslateRequest): Promise<ITranslateInfo> {
        return this.api.post(baseUrl, request)
    }

    delete(id: string): Promise {
        return this.api.delete(`${baseUrl}/${id}`)
    }

    history(id: string): Promise<ITranslateInfo[]> {
        return this.api.get(`${baseUrl}/${id}/history`)
    }

    approve(id: string, approved: boolean): Promise {
        return this.api.post(`${baseUrl}/${id}/approve`, {approved})
    }
}