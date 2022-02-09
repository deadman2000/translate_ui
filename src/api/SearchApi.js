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

    query(searchText: string): Promise<SearchResponse> {
        return this.api.http.post(baseUrl, {
            query: searchText
        }).then(result => result.data)
    }
}