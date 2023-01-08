import api from "@/api/Api"
import {MonoText} from "@/components/project/MonoText"
import {IFixMode} from "@/model/IFix"
import type {IFix} from "@/model/IFix"
import type {IProject} from "@/model/IProject"
import {GlobalStore} from "@/stores/GlobalStore"
import {AnchorButton, Button, FormGroup, Intent} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import {inject} from "mobx-react"
import React, {Component} from "react"
import {Container, Table} from "react-bootstrap"
import Diff from "react-stylable-diff"
import './Fixes.scss'

const COUNT = 10

type State = {
    modes: IFixMode[],
    mode: string,
    skip: string[],
    fixes: IFix[],
    hasNext: boolean,
    nextLoading: boolean
}

class FixSpacesList extends Component<{ project: IProject }, State> {
    state: State = {
        modes: [{mode: '', desc: '-'}],
        mode: '',
        skip: [],
        fixes: [],
        hasNext: false,
        nextLoading: true
    }

    componentDidMount() {
        api.fixes.modes().then((modes) => {
            const arr = this.state.modes
            arr.push(...modes)
            this.setState({modes: arr})
        })
    }

    render() {
        const {fixes} = this.state
        return <>
            {this.state.modes.length > 1 && (<Container className="pt-2">
                <FormGroup
                    label="Mode"
                    inline
                >
                    <select onChange={(e) => this.selectMode(e.target.value)} value={this.state.mode}>
                        {this.state.modes.map((m) => <option key={m.mode} value={m.mode}>
                            {m.desc}
                        </option>)}
                    </select>
                </FormGroup>
            </Container>)}
            <Table striped bordered>
                <thead>
                    <tr>
                        <th/>
                        <th/>
                        <th/>
                        <th style={{width: "1%"}}>
                            {this.state.fixes.length > 0 && (
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
                                        disabled={this.state.fixes.length === COUNT}
                            />)}
                        </th>
                    </tr>
                </thead>
                <tbody>
                {fixes.map((f) => <tr key={f.id}>
                    <td><AnchorButton
                        href={`/projects/${this.props.project.code}/volumes/${f.volume}#t${f.number}`}
                        target="_blank"
                        icon={IconNames.SHARE}
                        minimal/></td>
                    <td><MonoText text={f.src}/></td>
                    <td><pre className="fixes-text"><Diff
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
            fixes: [],
            skip: []
        }, () => this.next().then())
    }

    next = () => {
        if (!this.state.mode) return Promise.resolve()

        this.setState({nextLoading: true})
        return api.fixes.fixes(this.props.project.code, this.state.mode, COUNT, this.state.skip)
            .then((fixes) => {
                this.setState({
                    fixes,
                    hasNext: fixes.length === COUNT,
                    nextLoading: false
                })
            })
    }

    apply(fix: IFix) {
        api.fixes.apply(fix.id, fix.replaced)
            .then(() => this.removeFix(fix))
    }

    applyAll = () => {
        const {fixes} = this.state

        api.fixes.applyMany(fixes.map((f) => ({id: f.id, replace: f.replaced})))
            .then(this.next)
    }

    reject(fix: IFix) {
        const {skip} = this.state
        skip.push(fix.id)
        this.setState({skip})
        this.removeFix(fix)
    }

    removeFix(fix: IFix) {
        const {fixes} = this.state
        const i = fixes.indexOf(fix)
        fixes.splice(i, 1)
        this.setState({fixes})
        if (fixes.length === 0)
            this.next().then()
    }
}

@inject("global")
export class FixesPage extends React.Component<{global?: GlobalStore}> {
    render() {
        const project = this.props.global.project

        return <FixSpacesList project={project}/>
    }
}