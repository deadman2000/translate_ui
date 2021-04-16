import {action, makeObservable, observable, set} from "mobx";
import type {IProject} from "@/model/IProject";
import type {IMyInfo} from "@/model/IMyInfo";
import type {IVolume} from "@/model/IVolume";
import type {ITranslateInfo} from "@/model/ITranslateInfo";

export class GlobalStore {
    @observable project: IProject = {}
    @observable volume: IVolume = {}
    @observable info: IMyInfo = {}
    @observable currentHistory: ITranslateInfo[] = []

    constructor() {
        makeObservable(this)
    }

    @action
    setProject(project: IProject) {
        this.project = project
    }

    @action
    setVolume(volume: IVolume) {
        this.volume = volume
    }

    @action
    setUserInfo(info: IMyInfo) {
        set(this.info, info)
    }

    @action
    showHistory(list: ITranslateInfo[]) {
        this.currentHistory = list
    }

    @action
    hideHistory() {
        this.currentHistory = []
    }
}

const globalStore = new GlobalStore()

export default globalStore