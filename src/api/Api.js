import {FixesApi} from "@/api/FixesApi"
import axios from "axios";
import {axiosToastCatch} from "@/components/AppToaster";
import {ProjectsApi} from "@/api/ProjectsApi";
import {UsersApi} from "@/api/UsersApi";
import {ProjectApi} from "@/api/ProjectApi";
import {TranslateApi} from "@/api/TranslateApi";
import {SearchApi} from "@/api/SearchApi";
import {CommentsApi} from "@/api/CommentsApi";
import {InvitesApi} from "@/api/InvitesApi";
import {VideoApi} from "@/api/VideoApi";
import {NotifyApi} from "@/api/NotifyApi";

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

        this.projects = new ProjectsApi(this)
        this.users = new UsersApi(this)
        this.translate = new TranslateApi(this)
        this.search = new SearchApi(this)
        this.comments = new CommentsApi(this)
        this.invites = new InvitesApi(this)
        this.video = new VideoApi(this)
        this.notify = new NotifyApi(this)
        this.fixes = new FixesApi(this)
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

    delete(url: string) {
        return this.http.delete(url)
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

    project(code: string) {
        return new ProjectApi(this, code)
    }
}

const api = new Api()

export default api