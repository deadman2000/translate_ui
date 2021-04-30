import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Col, Container, Row, Table} from "react-bootstrap";
import {InputGroup} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {Popover2} from "@blueprintjs/popover2";

import api from "@/api/Api";
import type {ISearchResult} from "@/model/ISearchResult";
import type {RouteProps} from "@/types/RouteProps";
import './Search.scss'

type Props = {
    result: ISearchResult[],
    onClick: () => void
} & RouteProps

@withRouter
class SearchResult extends Component<Props> {
    render() {
        const {result} = this.props
        if (!result) return React.Fragment

        if (!result.length)
            return <Container>
                <Row><Col>No results.</Col></Row>
            </Container>

        return <Table striped className="search-result">
            <tbody>
            {result.map(r => <tr key={r.link}
                                 onClick={() => this.props.history.push(r.link)}
            >
                <td><a dangerouslySetInnerHTML={{__html: r.html}} href={r.link} onClick={this.props.onClick}/></td>
            </tr>)}
            </tbody>
        </Table>
    }
}

export default class Search extends Component<{}> {
    state = {
        value: '',
        result: null,
        isOpen: false,
    }

    timer = null

    render() {
        return <Popover2
            //isOpen={!!this.state.result}
            content={<SearchResult result={this.state.result} onClick={() => this.setState({isOpen: false})} />}
            interactionKind="click"
            isOpen={this.state.isOpen}
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
                leftIcon={IconNames.SEARCH}
                value={this.state.value}
                onChange={this.handleChange}
                round
            />
        </Popover2>
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
        if (this.state.value) {
            api.search.query(this.state.value)
                .then(result => this.setState({result}))
        } else {
            this.setState({result: null})
        }
    }
}
