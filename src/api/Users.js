import {Api} from "@/api/Api";

const baseUrl = '/users'

export class Users {
    constructor(api: Api) {
        this.api = api
    }

    auth(login: string, password: string) {
        return this.api.post(`${baseUrl}/login`, {login, password})
    }

    logout() {
        return this.api.post(`${baseUrl}/logout`)
    }

    me() {
        return this.api.http.get(`${baseUrl}/me`)
            .then(result => result.data)
    }
}