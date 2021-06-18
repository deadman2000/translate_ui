import {Api} from "./Api";
import {VolumeApi} from "@/api/VolumeApi";
import type {IProject} from "@/model/IProject";

export class ProjectApi {
    constructor(api: Api, project: string) {
        this.api = api
        this.project = project
        this.baseUrl = `/projects/${project}`
    }

    get(): Promise<IProject> {
        return this.api.get(this.baseUrl)
    }

    volume(volume: string): VolumeApi {
        return new VolumeApi(this, volume)
    }

    volumes() {
        return this.api.get(`${this.baseUrl}/volumes`)
    }

    reindex() {
        return this.api.post(`${this.baseUrl}/reindex`)
    }

    delete() {
        return this.api.delete(this.baseUrl)
    }
}