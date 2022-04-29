import type {IComment} from "@/model/IComment";

export type ITranslateInfo = {
    id: string,
    author: string,
    dateCreate: string,
    text: string,
    comments: IComment[],
}
