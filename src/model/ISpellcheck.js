import type {ISpellResult} from "@/model/ISpellResult"

export type ISpellcheck = {
    volume: string,
    number: number,
    text: string,
    spellcheck: ISpellResult[]
}