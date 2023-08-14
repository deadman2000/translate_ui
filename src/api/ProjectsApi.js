import {Api} from "./Api";
import type {IProject} from "@/model/IProject";

const baseUrl = '/projects'

export class ProjectsApi {
    constructor(api: Api) {
        this.api = api
    }

    list(): Promise<IProject[]> {
        return this.api.get(baseUrl)
    }

    get(code: string): Promise<IProject> {
        return this.api.get(`${baseUrl}/${code}`)
    }

    create(name: string, code: string, engine: string): Promise<IProject> {
        return this.api.post(`${baseUrl}/create`, {name, code, engine})
    }

    upload(code: string, file: File, onUploadProgress) {
        return this.api.upload(`${baseUrl}/${code}/upload`, file, onUploadProgress)
    }
}