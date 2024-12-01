import type {IMatchResult} from "@/model/IMatchResult";

export type IMatchTextResponse = {
    results: IMatchResult[],
    skip: string[],
}