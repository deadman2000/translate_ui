import {ITextTr} from "@/model/ITextTr"
import {Api} from "./Api";
import {VolumeApi} from "@/api/VolumeApi";
import type {IProject} from "@/model/IProject";
import type {IVolume} from "@/model/IVolume";
import type {IPatch} from "@/model/IPatch";
import {IValidate} from "@/model/IValidate";

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

    reindex(): Promise {
        return this.api.post(`${this.baseUrl}/reindex`)
    }

    delete(): Promise {
        return this.api.delete(this.baseUrl)
    }

    patches(): Promise<IPatch> {
        return this.api.get(`${this.baseUrl}/patches`)
    }

    uploadPatch(file: File, onUploadProgress): Promise {
        return this.api.upload(`${this.baseUrl}/patches`, file, onUploadProgress)
    }

    uploadZipPatch(file: File, onUploadProgress): Promise {
        return this.api.upload(`${this.baseUrl}/patches/zip`, file, onUploadProgress)
    }

    deletePatch(id: string): Promise {
        return this.api.delete(`${this.baseUrl}/patches/${id}`)
    }

    byUser(user: string): Promise<ITextTr[]> {
        return this.api.get(`${this.baseUrl}/byuser/${user}`)
    }

    import(file: File, onUploadProgress): Promise {
        return this.api.upload(`${this.baseUrl}/import`, file, onUploadProgress)
    }

    json(file: File, onUploadProgress): Promise {
        return this.api.upload(`${this.baseUrl}/json`, file, onUploadProgress)
    }

    setShared(share: boolean): Promise {
        return this.api.post(`${this.baseUrl}/share`, {share})
    }

    validate(): Promise<IValidate> {
        return this.api.get(`${this.baseUrl}/validate`)
    }
}