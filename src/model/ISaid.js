export type ISaid = {
    id: string,
    script: number,
    index: number,
    expression: string,
    patch?: string,
    approved: boolean,
    examples: string[],
    prints?: string
}