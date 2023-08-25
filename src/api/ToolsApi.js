import {Api} from "@/api/Api";

const baseUrl = '/tools'

export class ToolsApi {
    constructor(api: Api) {
        this.api = api
    }

    extractParser(project: string): Promise {
        return this.api.post(`${baseUrl}/parser/${project}`)
    }

    import(): Promise {
        return this.api.post(`${baseUrl}/import`)
    }
}