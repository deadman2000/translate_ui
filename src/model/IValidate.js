export type ITranslateError = {
    volume: string,
    number: number,
    tr: string,
    src: string,
    converted: string
}

export type IValidate = {
    symbols: ITranslateError[],
    lines: ITranslateError[]
}
