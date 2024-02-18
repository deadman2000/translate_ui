import api from "@/api/Api"
import {MonoText} from "@/components/project/MonoText"
import {IReplaceMode} from "@/model/IReplace"
import type {IReplace} from "@/model/IReplace"
import type {IProject} from "@/model/IProject"
import {GlobalStore} from "@/stores/GlobalStore"
import {AnchorButton, Button, FormGroup, InputGroup, Intent} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import {inject} from "mobx-react"
import React, {Component} from "react"
import {Col, Container, Row, Table} from "react-bootstrap"
import Diff from "react-stylable-diff"
import './Replace.scss'

const COUNT = 50

type State = {
    modes: IReplaceMode[],
    mode: string,
    skip: string[],
    replaces: IReplace[],
    hasNext: boolean,
    nextLoading: boolean,
    regex: string,
    replacement: string,
}

class ReplaceForm extends Component<{ project: IProject }, State> {
    state: State = {
        modes: [],
        mode: '_regex',
        skip: [],
        replaces: [],
        hasNext: false,
        nextLoading: true,
        regex: '',
        replacement: '',
    }

    componentDidMount() {
        api.replace.modes().then((modes) => {
            this.setState({modes})
        })
    }

    render() {
        const {replaces, modes, mode} = this.state
        const isRegex = mode === '_regex'

        return <>
            {modes.length > 1 && (<Container className="pt-2">
                <Row>
                    <Col className="col-3">
                        <FormGroup
                            label="Mode"
                            inline
                            className="mt-2"
                        >
                            <select onChange={(e) => this.selectMode(e.target.value)} value={mode}>
                                <option value="_regex">Regex</option>
                                {modes.map((m) => <option key={m.mode} value={m.mode}>
                                    {m.desc}
                                </option>)}
                            </select>
                        </FormGroup>
                    </Col>
                    {isRegex && <>
                        <Col className="col-3">
                            <Row className="pt-2">
                                <InputGroup
                                    placeholder="Regex"
                                    fill
                                    value={this.state.regex}
                                    onChange={(e) => this.setState({regex: e.target.value})}
                                />
                            </Row>
                            <Row className="pt-2 pb-2">
                                <InputGroup
                                    placeholder="Replacement"
                                    fill
                                    value={this.state.replacement}
                                    onChange={(e) => this.setState({replacement: e.target.value})}
                                />
                            </Row>
                        </Col>
                        <Col className="col-2">
                            <Button
                                className="mt-2"
                                text="SEARCH"
                                intent={Intent.PRIMARY}
                                onClick={this.searchClick}
                            />
                        </Col>
                    </>}
                </Row>
            </Container>)}
            <Table striped bordered>
                <thead>
                    <tr>
                        <th/>
                        <th/>
                        <th/>
                        <th style={{width: "1%"}}>
                            {this.state.replaces.length > 0 && (
                                <Button text="All"
                                        intent={Intent.SUCCESS}
                                        onClick={this.applyAll}
                                        loading={this.state.nextLoading}
                            />)}
                        </th>
                        <th style={{width: "1%"}}>
                            {this.state.hasNext && (
                                <Button text="Next"
                                        rightIcon={IconNames.ARROW_RIGHT}
                                        intent={Intent.PRIMARY}
                                        onClick={this.next}
                                        loading={this.state.nextLoading}
                                        disabled={this.state.replaces.length === COUNT}
                            />)}
                        </th>
                    </tr>
                </thead>
                <tbody>
                {replaces.map((f) => <tr key={f.id}>
                    <td><AnchorButton
                        href={`/projects/${this.props.project.code}/volumes/${f.volume}#t${f.number}`}
                        target="_blank"
                        icon={IconNames.SHARE}
                        minimal/></td>
                    <td><MonoText text={f.src}/></td>
                    <td><pre className="replace-text"><Diff
                        inputA={f.text}
                        inputB={f.replaced}
                        type="chars"
                    /></pre></td>
                    <td><Button text="Apply" intent={Intent.SUCCESS} onClick={() => this.apply(f)}/></td>
                    <td><Button text="Reject" intent={Intent.DANGER} onClick={() => this.reject(f)}/></td>
                </tr>)}
                </tbody>
            </Table>
        </>
    }

    selectMode(value: string) {
        this.setState({
            mode: value,
            replaces: [],
            skip: []
        }, this.next)
    }

    searchClick = () => {
        this.setState({
            replaces: [],
            skip: []
        }, this.next)
    }

    next = () => {
        const {mode, regex, replacement, skip} = this.state

        if (!mode) return Promise.resolve()

        this.setState({nextLoading: true})
        const promise = mode === '_regex'
            ? api.replace.regex(this.props.project.code, regex, replacement, COUNT, skip)
            : api.replace.get(this.props.project.code, mode, COUNT, skip)

        promise.then((replaces) => {
            this.setState({
                replaces,
                hasNext: replaces.length === COUNT,
                nextLoading: false
            })
        })
    }

    apply(fix: IReplace) {
        api.replace.apply(fix.id, fix.replaced)
            .then(() => this.removeFix(fix))
    }

    applyAll = () => {
        const {replaces} = this.state
        this.setState({nextLoading: true})

        api.replace.applyMany(replaces.map((f) => ({id: f.id, replace: f.replaced})))
            .then(this.next)
    }

    reject(fix: IReplace) {
        const {skip} = this.state
        skip.push(fix.id)
        this.setState({skip})
        this.removeFix(fix)
    }

    removeFix(fix: IReplace) {
        const {replaces} = this.state
        const i = replaces.indexOf(fix)
        replaces.splice(i, 1)
        this.setState({replaces})
        if (replaces.length === 0)
            this.next()
    }
}

@inject("global")
export class ReplacePage extends React.Component<{global?: GlobalStore}> {
    componentDidMount() {
        document.title = `Replace ${this.props.global.project.name}`;
    }

    render() {
        const project = this.props.global.project

        return <ReplaceForm project={project}/>
    }
}