import {Api} from "./Api";
import type {IVolumeInfo} from "@/model/IVolumeInfo";
import type {IVolume} from "@/model/IVolume";

export class Volumes {
    constructor(api: Api, project: string) {
        this.api = api
        this.baseUrl = `/projects/${project}/volumes`
    }

    list(): Promise<IVolumeInfo[]> {
        return this.api.get(this.baseUrl)
    }

    get(volume: string): Promise<IVolume> {
        return this.api.get(`${this.baseUrl}/${volume}`)
    }
}