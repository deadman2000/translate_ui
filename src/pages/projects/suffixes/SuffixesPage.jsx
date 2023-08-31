import api from "@/api/Api"
import LoaderComponent from "@/components/LoaderComponent"
import type {ISuffix} from "@/model/ISuffix"
import {EditSuffixDialog} from "@/pages/projects/suffixes/EditSuffixDialog"
import {classToStr, hex3} from "@/pages/projects/saids/utils"
import {GlobalStore} from "@/stores/GlobalStore"
import {Button, InputGroup, Intent} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import {inject} from "mobx-react"
import React from "react"
import {Col, Container, Row, Table} from "react-bootstrap"

type State = {
    suffixes: ISuffix[],
    dialog: boolean,
    edit: ISuffix,
    testWord: string,
    timer: number,
    testRes: string[]
}

@inject("global")
export default class SuffixesPage extends LoaderComponent<{ global?: GlobalStore }, State> {
    get project() {
        return this.props.global.project.code
    }

    prepare() {
        this.setState({testWord: '', timer: 0})
        return api.suffixes.get(this.project)
            .then((suffixes) => this.setState({suffixes}))
    }

    successRender() {
        return <Container className="pt-2">
            <EditSuffixDialog
                open={this.state.dialog}
                suffix={this.state.edit}
                create={this.saveSuffix}
                cancel={() => this.setState({dialog: false})}
            />
            <Row>
                <Col>
                    <Button icon={IconNames.ADD} text="Create suffix"
                            onClick={() => this.setState({dialog: true, edit: null})}/>
                </Col>
                <Col>
                    <InputGroup placeholder="word"
                                value={this.state.testWord}
                                onChange={(e) => {
                                    clearTimeout(this.state.timer)
                                    this.setState({
                                        testWord: e.target.value,
                                        timer: setTimeout(this.updateTest, 1000)
                                    })
                                }}
                                rightElement={<Button icon={IconNames.REFRESH}
                                                      minimal
                                                      onClick={this.updateTest}/>}
                    />
                </Col>
                <Col>
                    {this.state.testRes && this.state.testRes.map((s, i) => <div key={i}>{s}</div>)}
                </Col>
            </Row>
            <Table striped size="sm">
                <thead>
                <tr>
                    <th>In Class</th>
                    <th>Input</th>
                    <th>Out Class</th>
                    <th>Output</th>
                    <th>Words</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {this.state.suffixes.map((s) => <tr key={s.id}>
                    <td>{hex3(s.inClass)} {classToStr(s.inClass)}</td>
                    <td>{s.input}</td>
                    <td>{hex3(s.outClass)} {classToStr(s.outClass)}</td>
                    <td>{s.output}</td>
                    <td>{s.words}</td>
                    <td>{s.isTranslate && <>
                        <Button minimal
                                icon={IconNames.EDIT}
                                onClick={() => {
                                    this.setState({
                                        dialog: true,
                                        edit: s,
                                    })
                                }}
                        />
                        <Button minimal
                                icon={IconNames.TRASH}
                                intent={Intent.DANGER}
                                onClick={() => this.deleteSuffix(s)}
                        />
                    </>}</td>
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

    updateTest = () => {
        if (!this.state.testWord) {
            this.setState({testRes: null})
        } else {
            api.suffixes.test(this.project, this.state.testWord)
                .then((result) => this.setState({testRes: result}))
        }
    }
}