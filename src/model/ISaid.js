import type {ISaidValidateResult} from "@/model/ISaidValidateResult"
import type {ISaidTest} from "@/model/ISaidTest";

export type ISaid = {
    id: string,
    script: number,
    index: number,
    expression: string,
    patch?: string,
    approved: boolean,
    tests: ISaidTest[],
    prints?: string,
    validation: ISaidValidateResult
}