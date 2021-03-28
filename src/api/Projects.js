import {Api} from "./Api";
import type {IProject} from "@/model/IProject";

const baseUrl = '/projects'

export class Projects {
    constructor(api: Api) {
        this.api = api
    }

    list(): Promise<IProject[]> {
        return this.api.get(baseUrl)
    }

    get(shortName: string): Promise<IProject> {
        return this.api.get(`${baseUrl}/${shortName}`)
    }

    create(name: string, shortName: string): Promise<IProject> {
        return this.api.post(`${baseUrl}/create`, {name, shortName})
    }

    upload(projectId: string, file: File, onUploadProgress) {
        return this.api.upload(`${baseUrl}/${projectId}/upload`, file, onUploadProgress)
    }
}