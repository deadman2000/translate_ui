import {action, makeObservable, observable} from "mobx";
import type {IProject} from "@/model/IProject";
import type {IVolume} from "@/model/IVolume";
import type {ITranslateInfo} from "@/model/ITranslateInfo";

export class GlobalStore {
    @observable project: IProject = {}
    @observable volume: IVolume = {}
    @observable currentHistory: ITranslateInfo[] = []

    constructor() {
        makeObservable(this)
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
}

const globalStore = new GlobalStore()

export default globalStore