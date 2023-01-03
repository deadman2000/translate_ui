import {Api} from "@/api/Api";
import type {ISearchResult} from "@/model/ISearchResult";

const baseUrl = '/search'

export type SearchResponse = {
    query: string,
    result: ISearchResult[]
}

export class SearchApi {
    constructor(api: Api) {
        this.api = api
    }

    query(project: string, searchText: string, inSource: boolean, inTranslated: boolean): Promise<SearchResponse> {
        return this.api.http.post(baseUrl, {
            project,
            query: searchText,
            source: inSource,
            translated: inTranslated,
        }).then(result => result.data)
    }
}