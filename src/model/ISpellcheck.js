import type {ISpellResult} from "@/model/ISpellResult"

export type ISpellcheck = {
    id: string,
    volume: string,
    number: number,
    text: string,
    spellcheck: ISpellResult[]
}