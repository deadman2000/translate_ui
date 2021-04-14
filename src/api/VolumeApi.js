import {ProjectApi} from "@/api/ProjectApi";
import type {IVolume} from "@/model/IVolume";
import type {ITextsResponse} from "@/model/ITextsResponse";

export class VolumeApi {
    constructor(project: ProjectApi, volume: string) {
        this.api = project.api
        this.volume = volume
        this.baseUrl = `${project.baseUrl}/volumes/${volume}`
    }

    get(): Promise<IVolume> {
        return this.api.get(this.baseUrl)
    }

    texts(): Promise<ITextsResponse[]> {
        return this.api.get(`${this.baseUrl}/texts`)
    }
}