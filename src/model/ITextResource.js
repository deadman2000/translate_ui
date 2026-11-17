export type ITextResource = {
    id: string,
    project: string,
    volume: string,
    number: number,
    text: string,
    letters: number,
    translateApproved: boolean,
    userText?: boolean,
    description?: string
}
