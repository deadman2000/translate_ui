import {Api} from "./Api";

const baseUrl = '/project'

export class Project {
    constructor(api: Api) {
        this.api = api
    }

    list() {
        return this.api.get(baseUrl)
    }

    create(name: string, shortName: string) {
        return this.api.post(`${baseUrl}/create`, {name, shortName})
    }

    upload(file, onUploadProgress) {
        return this.api.upload(`${baseUrl}/upload`, file, onUploadProgress)
    }
}