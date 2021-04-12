import type {IVolume} from "@/model/IVolume";
import {ProjectApi} from "@/api/ProjectApi";
import type {ITextResource} from "@/model/ITextResource";

export class VolumeApi {
    constructor(project: ProjectApi, volume: string) {
        this.api = project.api
        this.volume = volume
        this.baseUrl = `${project.baseUrl}/volumes/${volume}`
    }

    get(): Promise<IVolume> {
        return this.api.get(this.baseUrl)
    }

    texts(): Promise<ITextResource> {
        return this.api.get(`${this.baseUrl}/texts`)
    }
}