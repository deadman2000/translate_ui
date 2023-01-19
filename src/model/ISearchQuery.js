export type ISearchQuery = {
    project: string,
    query: string,
    source: boolean,
    translated: boolean,
    regex: boolean,
    ignoreCase: boolean,
    skip?: number,
    size?: number
}