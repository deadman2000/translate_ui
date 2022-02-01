import {Api} from "./Api";
import type {IComment} from "@/model/IComment";

const baseUrl = '/comments'

export type ICommentRequest = {
    translateId: string,
    text: string,
}

export class CommentsApi {
    constructor(api: Api) {
        this.api = api
    }

    submit(request: ICommentRequest): Promise<IComment> {
        return this.api.post(`${baseUrl}/submit`, request)
    }

    byTranslate(translateId: string): Promise<IComment[]> {
        return this.api.get(`${baseUrl}/translate/${translateId}`)
    }

    delete(id: string): Promise {
        return this.api.delete(`${baseUrl}/${id}`)
    }

}