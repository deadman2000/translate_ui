import axios from "axios";
import {Projects} from "./Projects";
import {axiosToastCatch} from "@/components/AppToaster";

export class Api {
    constructor() {
        this.http = axios.create({
            baseURL: "/api",
            headers: {
                "Content-type": "application/json"
            }
        });

        this.projects = new Projects(this)
    }

    get(url: string) {
        return this.http.get(url)
            .catch(axiosToastCatch)
            .then(result => result.data)
    }

    post(url: string, data: any) {
        return this.http.post(url, data)
            .catch(axiosToastCatch)
            .then(result => result.data)
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
            .then(result => result.data);
    }
}

const api = new Api()

export default api