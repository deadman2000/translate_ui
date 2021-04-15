import {Api} from "@/api/Api";

export type ITranslateRequest = {
    project: string,
    volume: string,
    number: number,
    text: string
}

const baseUrl = '/translate'

export class TranslateApi {
    constructor(api: Api) {
        this.api = api
    }

    submit(request: ITranslateRequest): Promise {
        return this.api.post(baseUrl, request)
    }

    delete(project: string, volume: string, number: number): Promise {
        return this.api.delete(`${baseUrl}/${project}/${volume}/${number}`)
    }
}