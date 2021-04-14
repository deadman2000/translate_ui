import {Api} from "@/api/Api";
import type {IMyInfo} from "@/model/IMyInfo";

const baseUrl = '/users'

export class UsersApi {
    constructor(api: Api) {
        this.api = api
    }

    auth(login: string, password: string) {
        return this.api.post(`${baseUrl}/login`, {login, password})
    }

    logout() {
        return this.api.post(`${baseUrl}/logout`)
    }

    me(): Promise<IMyInfo> {
        return this.api.http.get(`${baseUrl}/me`)
            .then(result => result.data)
    }
}