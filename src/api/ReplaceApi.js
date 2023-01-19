import {Api} from "@/api/Api"
import {IReplaceMode} from "@/model/IReplace"
import type {IReplace} from "@/model/IReplace"

const baseUrl = '/replace'

export class ReplaceApi {
    constructor(api: Api) {
        this.api = api
    }

    modes(): Promise<IReplaceMode[]> {
        return this.api.get(`${baseUrl}/modes`)
    }

    get(project: string, mode: string, count: number, skip: string[]): Promise<IReplace[]> {
        return this.api.post(`${baseUrl}/${project}/get`, {mode, count, skip})
    }

    regex(project: string, regex: string, replace: string, count: number, skip: string[]): Promise<IReplace[]> {
        return this.api.post(`${baseUrl}/${project}/regex`, {regex, replace, count, skip})
    }

    apply(id: string, replace: string): Promise {
        return this.api.post(`${baseUrl}/apply`, {id, replace})
    }

    applyMany(items: {id: string, replace: string}[]): Promise {
        return this.api.post(`${baseUrl}/applyMany`, {items: items})
    }
}