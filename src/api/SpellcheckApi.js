import {Api} from "@/api/Api";
import {ISpellcheck} from "@/model/ISpellcheck"

const baseUrl = '/spellcheck'

export class SpellcheckApi {
    constructor(api: Api) {
        this.api = api
    }

    get(project: string): Promise<ISpellcheck[]> {
        return this.api.get(`${baseUrl}/${project}`)
    }

    skip(id: string, word: ?string): Promise {
        return this.api.post(`${baseUrl}/skip`, { id, word })
    }

    total(project: string): Promise<{total: number}> {
        return this.api.get(`${baseUrl}/${project}/total`)
    }
}