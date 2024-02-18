import {Api} from "@/api/Api";

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

    import(): Promise {
        return this.api.post(`${baseUrl}/import`)
    }
}