import {action, makeObservable, observable, set} from "mobx";
import type {IProject} from "@/model/IProject";
import type {IMyInfo} from "@/model/IMyInfo";

const DEFAULT_TITLE = "Translate"

export class GlobalStore {
    @observable title: string = DEFAULT_TITLE
    @observable project: IProject = {}
    @observable info: IMyInfo = {}

    constructor() {
        makeObservable(this)
    }

    @action
    setProject(project: IProject) {
        set(this.project, project)
        if (project)
            this.title = project.name
        else
            this.title = DEFAULT_TITLE
    }

    @action
    setUserInfo(info: IMyInfo) {
        set(this.info, info)
    }
}

const globalStore = new GlobalStore()

export default globalStore