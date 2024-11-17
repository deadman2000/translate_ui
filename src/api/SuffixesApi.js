import {Api} from "@/api/Api"
import type {ISuffix} from "@/model/ISuffix"

const baseUrl = '/suffixes'

export class SuffixesApi {
    constructor(api: Api) {
        this.api = api
    }

    get(project: string): Promise<ISuffix[]> {
        return this.api.get(`${baseUrl}/${project}`)
    }

    create(project: string, inCl: number, inp: string, outCl: number, out: string): Promise<ISuffix> {
        return this.api.post(`${baseUrl}/${project}`, {inCl, inp, outCl, out})
    }

    update(project: string, id: string, inCl: number, inp: string, outCl: number, out: string): Promise<ISuffix> {
        return this.api.post(`${baseUrl}/${project}/${id}`, {inCl, inp, outCl, out})
    }

    delete(project: string, id: string): Promise {
        return this.api.delete(`${baseUrl}/${project}/${id}`)
    }

    test(project: string, word: string): Promise<string[]> {
        return this.api.post(`${baseUrl}/${project}/test`, {word})
    }

    copy(project: string, src: string): Promise {
        return this.api.post(`${baseUrl}/${project}/copy/${src}`)
    }
}