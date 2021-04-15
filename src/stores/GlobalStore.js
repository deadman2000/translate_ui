import {action, makeObservable, observable, set} from "mobx";
import type {IProject} from "@/model/IProject";
import type {IMyInfo} from "@/model/IMyInfo";
import type {IVolume} from "@/model/IVolume";

export class GlobalStore {
    @observable project: IProject = {}
    @observable volume: IVolume = {}
    @observable info: IMyInfo = {}

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
}

const globalStore = new GlobalStore()

export default globalStore