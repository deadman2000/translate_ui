import {ITextTr} from "@/model/ITextTr"
import {Api} from "./Api";
import {VolumeApi} from "@/api/VolumeApi";
import type {IProject} from "@/model/IProject";
import type {IVolume} from "@/model/IVolume";
import type {IPatch} from "@/model/IPatch";

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

    volumes(): Promise<IVolume> {
        return this.api.get(`${this.baseUrl}/volumes`)
    }

    reindex() {
        return this.api.post(`${this.baseUrl}/reindex`)
    }

    delete() {
        return this.api.delete(this.baseUrl)
    }

    patches(): Promise<IPatch> {
        return this.api.get(`${this.baseUrl}/patches`)
    }

    uploadPatch(file: File, onUploadProgress) {
        return this.api.upload(`${this.baseUrl}/patches`, file, onUploadProgress)
    }

    deletePatch(id: string): Promise {
        return this.api.delete(`${this.baseUrl}/patches/${id}`)
    }

    byUser(user: string): Promise<ITextTr[]> {
        return this.api.get(`${this.baseUrl}/byuser/${user}`)
    }
}