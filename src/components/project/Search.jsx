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

export default class Search extends Component<{}> {
    state = {
        value: '',
        result: null,
        isOpen: false,
        inSource: true,
    }

    timer = null

    render() {
        const {inSource, result, isOpen, value} = this.state

        const button = (
            <Button
                text={inSource ? "EN": "RU"}
                //icon={IconNames.TRANSLATE}
                intent={Intent.WARNING}
                minimal={true}
                onClick={this.toggleSource}
            />
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
        const val = !this.state.inSource
        this.setState({inSource: val})
        this.search(val)
    }

    handleInteraction = (nextOpenState: boolean) => {
        this.setState({ isOpen: nextOpenState });
    }

    handleChange = e => {
        this.setState({value: e.target.value})
        clearTimeout(this.timer)
        this.timer = setTimeout(this.search, 300)
    }

    search = (inSourceOverride) => {
        const {value} = this.state

        let inSource = this.state.inSource
        if (inSourceOverride !== undefined)
            inSource = inSourceOverride

        if (value) {
            api.search.query(value, inSource, !inSource)
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
}
