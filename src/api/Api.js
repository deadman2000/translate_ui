import axios from "axios";
import {Projects} from "./Projects";
import {axiosToastCatch} from "@/components/AppToaster";
import {Volumes} from "@/api/Volumes";
import {Users} from "@/api/Users";

function dataExtract(e) {
    return e.data
}

export class Api {
    constructor() {
        this.http = axios.create({
            baseURL: "/api",
            headers: {
                "Content-type": "application/json"
            }
        });

        this.projects = new Projects(this)
        this.users = new Users(this)
    }

    get(url: string) {
        return this.http.get(url)
            .catch(axiosToastCatch)
            .then(dataExtract)
    }

    post(url: string, data: any) {
        return this.http.post(url, data)
            .catch(axiosToastCatch)
            .then(dataExtract)
    }

    upload(url: string, file: File, onUploadProgress: (progress: any) => void) {
        const formData = new FormData();
        formData.append("file", file);
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        }

        return this.http.post(url, formData, config)
            .catch(axiosToastCatch)
            .then(dataExtract);
    }

    volumes(project: string) {
        return new Volumes(this, project)
    }
}

const api = new Api()

export default api