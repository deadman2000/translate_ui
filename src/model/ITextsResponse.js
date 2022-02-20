import type {ITextResource} from "@/model/ITextResource";
import type {ITranslateInfo} from "@/model/ITranslateInfo";
import type {IVideoRef} from "@/model/IVideoRef";

export type ITextsResponse = {
    source: ITextResource,
    translates: ITranslateInfo[],
    refs: IVideoRef[]
}