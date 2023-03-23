import type {IMyInfo} from "@/model/IMyInfo"
import {action, makeObservable, observable} from "mobx";
import type {IProject} from "@/model/IProject";
import type {IVolume} from "@/model/IVolume";
import type {ITranslateInfo} from "@/model/ITranslateInfo";

export class GlobalStore {
    @observable project: IProject = {}
    @observable volume: IVolume = {}
    @observable currentHistory: ITranslateInfo[] = []
    @observable changePasswordOpen = false
    @observable hints = false
    @observable translatedLetters = {}
    @observable unread = 0
    @observable nonPrintShow = false

    constructor() {
        makeObservable(this)
        this.hints = localStorage.getItem('hints') === 'on'
        this.nonPrintShow = localStorage.getItem('non-print') === 'on'
    }

    get projectLetters() {
        if (!this.project || !this.project.code) return null
        return this.translatedLetters[this.project.code]
    }

    @action
    setProject(project: IProject) {
        if (!project) project = {}
        this.project = project
    }

    @action
    setVolume(volume: IVolume) {
        this.volume = volume
    }

    @action
    showHistory(list: ITranslateInfo[]) {
        this.currentHistory = list
    }

    @action
    hideHistory() {
        this.currentHistory = []
    }

    @action
    setChangePassword(isOpen: boolean) {
        this.changePasswordOpen = isOpen
    }

    @action
    setHints(enabled: boolean) {
        this.hints = enabled
        if (enabled)
            localStorage.setItem('hints', 'on')
        else
            localStorage.removeItem('hints')
    }

    @action
    addLetters(project: string, letters: number) {
        this.translatedLetters[project] += letters
    }

    @action
    subLetters(project: string, letters: number){
        this.translatedLetters[project] -= letters
    }

    @action
    setLetters(project: string, letters: number) {
        this.translatedLetters[project] = letters
    }

    @action
    setUserInfo(info: IMyInfo) {
        this.unread = info.unread
        for (const pl of info.letters) {
            this.translatedLetters[pl.project] = pl.letters
        }
    }

    @action
    setShowNonPrint(show: boolean) {
        this.nonPrintShow = show
        if (show)
            localStorage.setItem('non-print', 'on')
        else
            localStorage.removeItem('non-print')
    }

}

const globalStore = new GlobalStore()

export default globalStore