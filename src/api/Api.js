import {CommentsApi} from "@/api/CommentsApi";
import {InvitesApi} from "@/api/InvitesApi";
import {NotifyApi} from "@/api/NotifyApi";
import {ProjectApi} from "@/api/ProjectApi";
import {ProjectsApi} from "@/api/ProjectsApi";
import {ReplaceApi} from "@/api/ReplaceApi"
import {SaidsApi} from "@/api/SaidsApi"
import {SearchApi} from "@/api/SearchApi";
import {SpellcheckApi} from "@/api/SpellcheckApi"
import {SuffixesApi} from "@/api/SuffixesApi"
import {SynonymsApi} from "@/api/SynonymsApi"
import {ToolsApi} from "@/api/ToolsApi"
import {TranslateApi} from "@/api/TranslateApi";
import {UsersApi} from "@/api/UsersApi";
import {VideoApi} from "@/api/VideoApi";
import {WordsApi} from "@/api/WordsApi"
import {axiosToastCatch} from "@/components/AppToaster";
import axios from "axios";

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
        this.replace = new ReplaceApi(this)
        this.spellcheck = new SpellcheckApi(this)
        this.tools = new ToolsApi(this)
        this.words = new WordsApi(this)
        this.suffixes = new SuffixesApi(this)
        this.saids = new SaidsApi(this)
        this.synonyms = new SynonymsApi(this)
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