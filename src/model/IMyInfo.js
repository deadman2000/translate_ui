export type IProjectLetters = {
    project: string,
    letters: number,
}

export type IMyInfo = {
    login: string,
    role: string,
    letters: IProjectLetters[],
    unread: number,
}