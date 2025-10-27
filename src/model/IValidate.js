export type ITranslateError = {
    volume: string,
    number: number,
    tr: string,
    src: string,
    converted: string
}

export type IValidate = {
    multiples: {volume: string, number: number}[],
    symbols: ITranslateError[],
    lines: ITranslateError[]
}
