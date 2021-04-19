import React, {Component} from "react";
import {InputGroup} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {Popover2} from "@blueprintjs/popover2";
import {Col, Container, Row} from "react-bootstrap";

import api from "@/api/Api";
import type {ISearchResult} from "@/model/ISearchResult";
import './Search.scss'

class SearchResult extends Component<{result: ISearchResult[]}> {
    render() {
        const {result} = this.props
        return <Container className="search-result">
            {result.length
            ? result.map(r => <Row key={r.link}>
                <Col><a dangerouslySetInnerHTML={{__html: r.html}} href={r.link}/></Col>
            </Row>)
            : <Row><Col>No results.</Col></Row>}
        </Container>
    }
}

export default class Search extends Component<{}> {
    state = {
        value: '',
        result: undefined
    }

    timer = null

    render() {
        return <Popover2
            isOpen={!!this.state.result}
            content={<SearchResult result={this.state.result} />}
            minimal
            autoFocus={false}
            enforceFocus={false}
            position="bottom-right"
        >
            <InputGroup
                placeholder="Search"
                leftIcon={IconNames.SEARCH}
                value={this.state.value}
                onChange={this.handleChange}
            />
        </Popover2>
    }

    handleChange = e => {
        this.setState({value: e.target.value})
        clearTimeout(this.timer)
        this.timer = setTimeout(this.search, 300)
    }

    search = () => {
        api.search.query(this.state.value)
            .then(result => this.setState({result}))
    }
}
