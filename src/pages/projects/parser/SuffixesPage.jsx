import api from "@/api/Api"
import LoaderComponent from "@/components/LoaderComponent"
import type {ISuffix} from "@/model/ISuffix"
import {EditSuffixDialog} from "@/pages/projects/parser/EditSuffixDialog"
import {classToStr, hex3} from "@/pages/projects/parser/utils"
import {GlobalStore} from "@/stores/GlobalStore"
import {Button, Intent} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import {inject} from "mobx-react"
import React from "react"
import {Container, Table} from "react-bootstrap"

type State = {
    suffixes: ISuffix[],
    dialog: boolean,
    edit: ISuffix
}

@inject("global")
export default class SuffixesPage extends LoaderComponent<{ global?: GlobalStore }, State> {
    get project() {
        return this.props.global.project.code
    }

    prepare() {
        return api.suffixes.get(this.project)
            .then((suffixes) => this.setState({suffixes}))
    }

    successRender() {
        return <Container className="pt-2">
            <Button icon={IconNames.ADD} text="Create suffix"
                    onClick={() => this.setState({dialog: true, edit: null})}/>
            <EditSuffixDialog
                open={this.state.dialog}
                suffix={this.state.edit}
                create={this.saveSuffix}
                cancel={() => this.setState({dialog: false})}
            />
            <Table striped size="sm">
                <thead>
                <tr>
                    <th>In Class</th>
                    <th>Input</th>
                    <th>Out Class</th>
                    <th>Output</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {this.state.suffixes.map((s) => <tr key={s.id}>
                    <td>{hex3(s.inClass)} {classToStr(s.inClass)}</td>
                    <td>{s.input}</td>
                    <td>{hex3(s.outClass)} {classToStr(s.outClass)}</td>
                    <td>{s.output}</td>
                    <td>{s.isTranslate && ([
                        <Button minimal
                                icon={IconNames.EDIT}
                                onClick={() => {
                                    this.setState({
                                        dialog: true,
                                        edit: s,
                                    })
                                }}
                        />,
                        <Button minimal
                                icon={IconNames.TRASH}
                                intent={Intent.DANGER}
                                onClick={() => this.deleteSuffix(s)}
                        />
                    ])}</td>
                </tr>)}
                </tbody>
            </Table>
        </Container>
    }

    saveSuffix = (inCl: number, inp: string, outCl: number, out: string) => {
        const {edit} = this.state
        if (edit) {
            api.suffixes.update(this.project, edit.id, inCl, inp, outCl, out)
                .then((s) => {
                    const ind = this.state.suffixes.indexOf(edit)
                    this.state.suffixes[ind] = s
                    this.setState({
                        suffixes: this.state.suffixes,
                        dialog: false
                    })
                })
        } else {
            api.suffixes.create(this.project, inCl, inp, outCl, out)
                .then((s) => {
                    this.state.suffixes.unshift(s)
                    this.setState({
                        suffixes: this.state.suffixes,
                        dialog: false,
                        edit: null
                    })
                })
        }
    }

    deleteSuffix(s: ISuffix) {
        api.suffixes.delete(this.project, s.id)
            .then(() => {
                const i = this.state.suffixes.indexOf(s)
                this.state.suffixes.splice(i, 1)
                this.setState({suffixes: this.state.suffixes})
            })
    }
}