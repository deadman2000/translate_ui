import api from "@/api/Api"
import type {ISearchResult} from "@/model/ISearchResult"
import {AnchorButton, Button, InputGroup, Intent} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import React, {Component} from "react"
import type {RouteProps} from "@/types/RouteProps"
import {Container, Table} from "react-bootstrap"
import {withRouter} from "react-router-dom"

type State = {
    query: string,
    value: string,
    result: ISearchResult[],
    mode: number,
    regex: boolean,
    ignoreCase: boolean,
}

@withRouter
export default class SearchPage extends Component<RouteProps, State> {
    state: State = {
        query: '',
        value: '',
        result: [],
        mode: 0,
        regex: false,
        ignoreCase: true,
    }

    render() {
        const globalSearch = !this.props.match.params.project

        const buttons = (
            <>
                <Button
                    text={this.modeText()}
                    //icon={IconNames.TRANSLATE}
                    minimal
                    onClick={this.toggleSource}
                    autoFocus={false}
                />
                <Button
                    text="Aa"
                    minimal
                    onClick={this.toggleCase}
                    autoFocus={false}
                    active={!this.state.ignoreCase}
                />
                <Button
                    text=".*"
                    minimal
                    onClick={this.toggleRegex}
                    autoFocus={false}
                    active={this.state.regex}
                />
                <Button
                    intent={Intent.PRIMARY}
                    text="SEARCH"
                    onClick={this.setQuery}
                />
            </>
        )

        return <div className="content">
            <Container className="pt-4 pb-4">
                <InputGroup
                    leftIcon={IconNames.SEARCH}
                    value={this.state.value}
                    onChange={(e) => this.setState({value: e.target.value})}
                    onKeyPress={(e) => {if (e.key === "Enter") this.setQuery()}}
                    rightElement={buttons}
                />
            </Container>
            <Table striped className="search-result-full">
                <thead>
                    <tr>
                        <th className="min-width"/>
                        {globalSearch && <th className="min-width">Project</th>}
                        <th className="min-width">Volume</th>
                        <th className="min-width">#</th>
                        <th>Text</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.result.map((r) => {
                    return <tr key={r.id}>
                        <td><AnchorButton
                            href={`/projects/${r.project}/volumes/${r.volume}#t${r.number}`}
                            target="_blank"
                            icon={IconNames.SHARE}
                            minimal
                        /></td>
                        {globalSearch && <td>{r.project}</td>}
                        <td>{r.volume}</td>
                        <td>{r.number}</td>
                        <td dangerouslySetInnerHTML={{__html: r.html}}/>
                    </tr>
                })}
                </tbody>
            </Table>
        </div>
    }

    modeText() {
        switch (this.state.mode) {
            case 0: return "ALL"
            case 1: return "EN"
            case 2: return "RU"
        }
    }

    toggleSource = () => {
        let newMode = this.state.mode + 1
        if (newMode > 2) newMode = 0
        this.setState({mode: newMode}, this.doSearch)
    }

    toggleRegex = () => {
        this.setState({regex: !this.state.regex}, this.doSearch)
    }

    toggleCase = () => {
        this.setState({ignoreCase: !this.state.ignoreCase}, this.doSearch)
    }

    setQuery = () => {
        if (this.state.value) {
            this.setState({
                query: this.state.value
            }, this.doSearch)
        }
    }

    doSearch = () => {
        const {query, mode, regex, ignoreCase} = this.state

        const inSource = mode === 0 || mode === 1
        const inTr = mode === 0 || mode === 2

        if (query) {
            api.search.query({
                project: this.props.match.params.project,
                query,
                source: inSource,
                translated: inTr,
                size: 100,
                regex,
                ignoreCase
            }).then(response => {
                if (response.query === query) {
                    this.setState({
                        result: response.result,
                    })
                }
            })
        }
    }
}