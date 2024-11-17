import {Api} from "@/api/Api";
import {IEncoding} from "@/model/IEncoding";

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
}