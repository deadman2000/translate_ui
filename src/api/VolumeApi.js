import {ProjectApi} from "@/api/ProjectApi";
import type {IVolume} from "@/model/IVolume";
import type {ITextsResponse} from "@/model/ITextsResponse";

export type IVolumeUpdateRequest = {
    description: string
}

export class VolumeApi {
    constructor(project: ProjectApi, volume: string) {
        this.api = project.api
        this.volume = volume
        this.baseUrl = `${project.baseUrl}/volumes/${volume}`
    }

    get(): Promise<IVolume> {
        return this.api.get(this.baseUrl)
    }

    update(request: IVolumeUpdateRequest): Promise {
        return this.api.post(this.baseUrl, request)
    }

    texts(): Promise<ITextsResponse[]> {
        return this.api.get(`${this.baseUrl}/texts`)
    }
}