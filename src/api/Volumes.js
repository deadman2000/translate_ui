import {Api} from "./Api";
import type {IVolume} from "@/model/IVolume";
import {Texts} from "@/api/Texts";

export class Volumes {
    constructor(api: Api, project: string) {
        this.api = api
        this.project = project
        this.baseUrl = `/projects/${project}/volumes`
    }

    list(): Promise<IVolume[]> {
        return this.api.get(this.baseUrl)
    }

    get(volume: string): Promise<IVolume> {
        return this.api.get(`${this.baseUrl}/${volume}`)
    }

    texts(volume: string) {
        return new Texts(this.api, this.project, volume)
    }
}