import {Api} from "@/api/Api";
import {IEncoding} from "@/model/IEncoding";
import {IMatchTextResponse} from "@/model/IMatchTextResponse";

const baseUrl = '/tools'

export class ToolsApi {
    constructor(api: Api) {
        this.api = api
    }

    extractParser(project: string): Promise {
        return this.api.post(`${baseUrl}/parser/${project}`)
    }

    prints(project: string): Promise {
        return this.api.post(`${baseUrl}/prints/${project}`)
    }

    import(from: string, to: string): Promise {
        return this.api.post(`${baseUrl}/import/${from}/${to}`)
    }

    encodings(): Promise<IEncoding[]> {
        return this.api.get(`${baseUrl}/encodings`)
    }

    matchText(project: string, from: string, skip: string[], take: number): Promise<IMatchTextResponse> {
        return this.api.post(`${baseUrl}/text_match/${project}`, {from, skip, take})
    }
}