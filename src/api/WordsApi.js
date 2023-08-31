import {Api} from "@/api/Api"
import type {IWord} from "@/model/IWord"

const baseUrl = '/words'

export class WordsApi {
    constructor(api: Api) {
        this.api = api
    }

    get(project: string): Promise<IWord[]> {
        return this.api.get(`${baseUrl}/${project}`)
    }

    words(project: string, id: number): Promise<string[]> {
        return this.api.get(`${baseUrl}/${project}/${id}`)
    }

    translate(project: string, gr: number, cl: number, words: string): Promise<IWord> {
        return this.api.post(`${baseUrl}/${project}`, {words, gr, cl})
    }

    dublicate(project: string): Promise<string[]> {
        return this.api.get(`${baseUrl}/dublicate/${project}`)
    }
}