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

    translate(project: string, gr: number, cl: number, words: string): Promise<IWord> {
        return this.api.post(`${baseUrl}/${project}`, {words, gr, cl})
    }
}