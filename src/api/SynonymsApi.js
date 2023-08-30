import {Api} from "@/api/Api"
import type {ISynonym} from "@/model/ISynonym"

const baseUrl = '/synonyms'

export class SynonymsApi {
    constructor(api: Api) {
        this.api = api
    }

    get(project: string, script: number): Promise<ISynonym[]> {
        return this.api.get(`${baseUrl}/${project}/${script}`)
    }

    create(project: string, script: number, wordA: string, wordB: string): Promise<ISynonym> {
        return this.api.post(`${baseUrl}/${project}/${script}`, {wordA, wordB})
    }

    restore(id: string): Promise {
        return this.api.post(`${baseUrl}/restore/${id}`)
    }

    delete(id: string): Promise {
        return this.api.delete(`${baseUrl}/${id}`)
    }
}