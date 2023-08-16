import {Api} from "@/api/Api";

const baseUrl = '/tools'

export class ToolsApi {
    constructor(api: Api) {
        this.api = api
    }

    setupSaids(project: string): Promise {
        return this.api.post(`${baseUrl}/setup_said/${project}`)
    }
}