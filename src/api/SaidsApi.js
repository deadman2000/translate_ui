import {Api} from "@/api/Api"
import type {ISaid} from "@/model/ISaid"
import {ISaidScript} from "@/model/ISaidScript"
import type {ISaidValidateResult} from "@/model/ISaidValidateResult"

const baseUrl = '/saids'

export class SaidsApi {
    constructor(api: Api) {
        this.api = api
    }

    scripts(project: string): Promise<ISaidScript[]> {
        return this.api.get(`${baseUrl}/${project}`)
    }

    get(project: string, script: number): Promise<ISaid[]> {
        return this.api.get(`${baseUrl}/${project}/${script}`)
    }

    update(project: string, script: number, index: number, patch: string, examples: string[]): Promise<ISaid> {
        return this.api.post(`${baseUrl}/update`, {project, script, index, patch, examples})
    }

    approve(project: string, script: number, index: number, approved: boolean): Promise {
        return this.api.post(`${baseUrl}/approve`, {project, script, index, approved})
    }

    prints(project: string, prints: string): Promise<{ text: string, tr: string }[]> {
        return this.api.get(`${baseUrl}/${project}/prints/${prints}`)
    }

    validate(project: string, said: string, examples: string[]): Promise<ISaidValidateResult> {
        return this.api.post(`${baseUrl}/${project}/validate`, {said, examples})
    }

    translate(project: string, said: string): Promise<string> {
        return this.api.post(`${baseUrl}/${project}/translate`, {said})
    }
}