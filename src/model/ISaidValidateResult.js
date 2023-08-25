export type IValidateWord = {
    word: string,
    isValid: boolean,
    ids: string[]
}

export type IValidateExample = {
    words: IValidateWord[],
    match: boolean,
    tree: string,
    error: string,
    errWords: string[]
}

export type ISaidValidateResult = {
    error: string,
    errWord: string,
    said: string[],
    saidTree: string,
    examples: IValidateExample[]
}