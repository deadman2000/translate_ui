import globalStore from "@/stores/GlobalStore"
import {IconNames} from "@blueprintjs/icons"
import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Col, Container, Row, Table} from "react-bootstrap";
import {Button, InputGroup, Intent} from "@blueprintjs/core";
import {Popover2} from "@blueprintjs/popover2";

import api from "@/api/Api";
import type {ISearchResult} from "@/model/ISearchResult";
import type {RouteProps} from "@/types/RouteProps";
import './Search.scss'

@withRouter
class SearchResultRow extends Component<{ res: ISearchResult } & RouteProps> {
    render() {
        let {res, history} = this.props;
        const link = `/projects/${res.project}/volumes/${res.volume}#t${res.number}`
        return <tr onClick={() => history.push(link)}>
            <td><a dangerouslySetInnerHTML={{__html: res.html}} href={link}/></td>
        </tr>
    }
}

type Props = {
    result: ISearchResult[],
    onClick: () => void
}

class SearchResult extends Component<Props> {
    render() {
        const {result} = this.props
        if (!result) return React.Fragment

        if (!result.length)
            return <Container>
                <Row><Col><p>No results.</p></Col></Row>
            </Container>

        return <Table striped className="search-result">
            <tbody onClick={this.props.onClick}>
            {result.map(r => <SearchResultRow key={r.id} res={r}/>)}
            </tbody>
        </Table>
    }
}

@withRouter
export default class Search extends Component<RouteProps<>> {
    state = {
        value: '',
        result: null,
        isOpen: false,
        mode: 0,
    }

    timer = null

    modeText() {
        switch (this.state.mode) {
            case 0: return "ALL"
            case 1: return "EN"
            case 2: return "RU"
        }
    }

    render() {
        const {result, isOpen, value} = this.state

        const button = (
            <>
                <Button
                    text={this.modeText()}
                    //icon={IconNames.TRANSLATE}
                    intent={Intent.WARNING}
                    minimal
                    onClick={this.toggleSource}
                    autoFocus={false}
                />
                <Button
                    icon={IconNames.SEARCH}
                    minimal
                    onClick={this.searchClick}
                    autoFocus={false}
                />
            </>
        )

        return <Popover2
            content={<SearchResult result={result} onClick={() => this.setState({isOpen: false})} />}
            interactionKind="click"
            isOpen={isOpen}
            onInteraction={this.handleInteraction}
            minimal
            autoFocus={false}
            enforceFocus={false}
            openOnTargetFocus
            position="bottom"
            popoverClassName="search-result-popover"
        >
            <InputGroup
                placeholder="Search"
                //leftIcon={IconNames.SEARCH}
                value={value}
                onChange={this.handleChange}
                rightElement={button}
                round
            />
        </Popover2>
    }

    toggleSource = () => {
        let newMode = this.state.mode + 1
        if (newMode > 2) newMode = 0
        this.setState({mode: newMode}, this.search)
    }

    handleInteraction = (nextOpenState: boolean) => {
        this.setState({ isOpen: nextOpenState });
    }

    handleChange = e => {
        this.setState({value: e.target.value})
        clearTimeout(this.timer)
        this.timer = setTimeout(this.search, 300)
    }

    search = () => {
        const {value, mode} = this.state

        const inSource = mode === 0 || mode === 1
        const inTr = mode === 0 || mode === 2

        const proj = globalStore.project ? globalStore.project.code : null

        if (value) {
            api.search.query({
                project: proj,
                query: value,
                source: inSource,
                translated: inTr,
                size: 10
            })
                .then(response => {
                    if (response.query === value) {
                        this.setState({
                            result: response.result,
                            isOpen: true
                        })
                    }
                })
        } else {
            this.setState({
                result: null,
                isOpen: false
            })
        }
    }

    searchClick = () => {
        if (globalStore.project.code) {
            this.props.history.push(`/projects/${globalStore.project.code}/search/${encodeURIComponent(this.state.value)}`)
        } else
            this.props.history.push(`/search/${encodeURIComponent(this.state.value)}`)
    }
}
