import {Api} from "@/api/Api";
import {ISearchQuery} from "@/model/ISearchQuery"
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

    query(query: ISearchQuery): Promise<SearchResponse> {
        return this.api.post(baseUrl, query)
    }
}