import type {IProjectLetters} from "@/model/IMyInfo"

export type IUser = {
    id: string,
    login: string,
    role: string,
    letters: number,
    lettersByProject: IProjectLetters[],
}