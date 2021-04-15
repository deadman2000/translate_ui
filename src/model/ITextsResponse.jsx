import type {ITextResource} from "@/model/ITextResource";
import type {ITextTranslate} from "@/model/ITextTranslate";

export type ITextsResponse = {
    source: ITextResource,
    my: ITextTranslate
    translates: ITextTranslate[]
}