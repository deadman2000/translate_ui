import {Api} from "./Api";
import type {ITextResource} from "@/model/ITextResource";

export class Texts {
    constructor(api: Api, project: string, volume: string) {
        this.api = api
        this.baseUrl = `/projects/${project}/volumes/${volume}/texts`
    }

    list(): Promise<ITextResource[]> {
        return this.api.get(this.baseUrl)
    }
}