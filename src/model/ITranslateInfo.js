import type {IComment} from "@/model/IComment";
import type {ISpellResult} from "@/model/ISpellResult"

export type ITranslateInfo = {
    id: string,
    author: string,
    editor: string,
    dateCreate: string,
    text: string,
    comments: IComment[],
    spellcheck: ISpellResult[]
}
