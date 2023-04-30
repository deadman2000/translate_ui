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

    skip(project: string, spell: ISpellcheck): Promise {
        return this.api.post(`${baseUrl}/${project}/skip`, {
            volume: spell.volume,
            number: spell.number
        })
    }

    total(project: string): Promise<{total: number}> {
        return this.api.get(`${baseUrl}/${project}/total`)
    }
}