import {Api} from "./Api";
import type {IVideo} from "@/model/IVideo";
import {IRunner} from "@/model/IRunner";

const baseUrl = '/video'

export class VideoApi {
    constructor(api: Api) {
        this.api = api
    }

    list(): Promise<IVideo[]> {
        return this.api.get(baseUrl)
    }

    create(video: IVideo): Promise<IVideo> {
        return this.api.post(baseUrl, video)
    }

    delete(video: IVideo): Promise {
        return this.api.delete(`${baseUrl}/${video.videoId}`)
    }

    runners(): Promise<IRunner[]> {
        return this.api.get(`${baseUrl}/runners`)
    }
}
