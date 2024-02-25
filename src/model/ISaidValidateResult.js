export type IValidateWord = {
    word: string,
    isValid: boolean,
    ids: string[]
}

export type ISaidTestResult = {
    words: IValidateWord[],
    match: boolean,
    success: boolean,
    tree: string,
    error: string,
    errWords: string[]
}

export type ISaidValidateResult = {
    error: string,
    errWord: string,
    said: string[],
    saidTree: string,
    tests: ISaidTestResult[],
    valid: boolean
}