import {action, makeObservable, observable, set} from "mobx";
import type {IProject} from "@/model/IProject";

const DEFAULT_TITLE = "Translate"

export class GlobalStore {
    @observable title: string = DEFAULT_TITLE
    @observable project: IProject = {}

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
}

const globalStore = new GlobalStore()

export default globalStore