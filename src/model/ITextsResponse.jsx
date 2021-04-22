import type {ITextResource} from "@/model/ITextResource";
import type {ITranslateInfo} from "@/model/ITranslateInfo";

export type ITextsResponse = {
    source: ITextResource,
    translates: ITranslateInfo[]
}