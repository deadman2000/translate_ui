import {Api} from "@/api/Api";
import type {ISearchResult} from "@/model/ISearchResult";

const baseUrl = '/search'

export class SearchApi {
    constructor(api: Api) {
        this.api = api
    }

    query(searchText: string): Promise<ISearchResult[]> {
        return this.api.http.post(baseUrl, {
            query: searchText
        }).then(result => result.data)
    }
}