export type ITranslateError = {
    volume: string,
    number: number,
    text: string,
    converted: string
}

export type IValidate = {
    symbols: ITranslateError[]
}
