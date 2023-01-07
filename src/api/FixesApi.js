import {Api} from "@/api/Api"
import {IFixMode} from "@/model/IFix"
import type {IFix} from "@/model/IFix"

const baseUrl = '/fixes'

export class FixesApi {
    constructor(api: Api) {
        this.api = api
    }

    modes(): Promise<IFixMode[]> {
        return this.api.get(`${baseUrl}/modes`)
    }

    fixes(project: string, mode: string, count: number, skip: string[]): Promise<IFix[]> {
        return this.api.post(`${baseUrl}/${project}/get`, {mode, count, skip})
    }

    apply(id: string, replace: string): Promise {
        return this.api.post(`${baseUrl}/apply`, {id, replace})
    }

    applyMany(items: {id: string, replace: string}[]): Promise {
        return this.api.post(`${baseUrl}/applyMany`, {items: items})
    }
}