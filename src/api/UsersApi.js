import {Api} from "@/api/Api";
import type {IMyInfo} from "@/model/IMyInfo";
import type {IUser} from "@/model/IUser";

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
        return this.api.http.get(`${baseUrl}/me`) // use `http` because on dead session `api` shows toast
            .then(result => result.data)
    }

    changePassword(password: string) {
        return this.api.post(`${baseUrl}/changepassword`, {password})
    }

    // Administration

    list(): Promise<IUser> {
        return this.api.get(baseUrl)
    }

    delete(id: string): Promise {
        return this.api.delete(`${baseUrl}/${id}`)
    }

    setPassword(id: string, password: string): Promise {
        return this.api.post(`${baseUrl}/setpassword`, {
            userId: id,
            password
        })
    }

    chart(id: string): Promise {
        return this.api.get(`${baseUrl}/${id}/chart`)
    }

    chart_by_proj(id: string, project: string): Promise {
        return this.api.get(`${baseUrl}/${id}/chart/${project}`)
    }
}