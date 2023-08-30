import type {ISaidValidateResult} from "@/model/ISaidValidateResult"

export type ISaid = {
    id: string,
    script: number,
    index: number,
    expression: string,
    patch?: string,
    approved: boolean,
    examples: string[],
    prints?: string,
    validation: ISaidValidateResult
}