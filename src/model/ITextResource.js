export type ITextResource = {
    id: string,
    project: string,
    volume: string,
    number: number,
    text: string,
    talker?: number,
    verb?: number,
    noun?: string[],
    letters: number,
    translateApproved: boolean,
    description?: string
}
