import api from "@/api/Api"
import LoaderComponent from "@/components/LoaderComponent"
import type {ISaid} from "@/model/ISaid"
import type {IValidateExample} from "@/model/ISaidValidateResult"
import type {ISynonym} from "@/model/ISynonym"
import {SaidEditDialog} from "@/pages/projects/parser/SaidEditDialog"
import type {RouteProps} from "@/types/RouteProps"
import {Button, H4, Icon, InputGroup, Intent} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import {Tooltip2} from "@blueprintjs/popover2"
import React, {useState} from "react"
import {Table} from "react-bootstrap"
import Highlighter from "react-highlight-words"
import {withRouter} from "react-router-dom"
import './Saids.scss'

function SaidHighlight(props: { said: ISaid }) {
    const txt = props.said.patch
    const enWords = txt.match(/([a-z]+)/g)
    if (enWords) {
        return <Highlighter highlightClassName="en"
                            searchWords={enWords}
                            textToHighlight={txt}
                            highlightTag="span"
        />
    }
    return txt
}

function Prints(props: { project: string, said: ISaid }) {
    const {project, said} = props
    const [prints, setPrints] = useState([])

    const loadPrints = () => {
        if (prints.length) return
        api.saids.prints(project, said.prints)
            .then((list) => {
                setPrints(list)
            })
    }


    const tooltip = prints.length ? (
        <table style={{maxWidth: 600}} className="print-table">
            <tbody>
            {prints.map((p, i) => <tr key={i}>
                <td>{p.text}</td>
                <td>{p.tr}</td>
            </tr>)}
            </tbody>
        </table>
    ) : "..."

    return <Tooltip2 content={tooltip} onOpening={loadPrints}>
        <Button icon={IconNames.COMMENT} minimal/>
    </Tooltip2>
}

function ApproveButton(props: { project: string, said: ISaid }) {
    const {project, said} = props
    const [approved, setApproved] = useState(said.approved)

    const toggleApprove = () => {
        const val = !approved
        api.saids.approve(project, said.script, said.index, val)
            .then(() => setApproved(val))
    }

    return <Button icon={approved ? IconNames.TICK_CIRCLE : IconNames.TICK}
                   intent={approved ? Intent.SUCCESS : Intent.NONE}
                   minimal
                   onClick={toggleApprove}
    />
}

function ExampleError(props: { str: string, example: IValidateExample }) {
    const {str, example} = props
    if (example.errWords)
        return <Highlighter highlightClassName="en"
                            searchWords={example.errWords}
                            textToHighlight={str}
                            highlightTag="span"
        />

    if (example.error)
        return <>{str}: <span className="en">{example.error}</span></>

    return <>{str} <Icon icon={IconNames.CROSS} intent={Intent.DANGER}/></>
}

function SaidValidation(props: { said: ISaid }) {
    const {said} = props
    if (!said.validation)
        return null

    if (said.validation.valid) {
        if (said.validation.examples.length === 0)
            return null
        return <Icon icon={IconNames.THUMBS_UP}
                     className="color-gray"/>
    }

    const tooltipContent = () => {
        if (said.validation.error)
            return said.validation.error

        return said.validation.examples
            .map((e, i) => [e, said.examples[i]])
            .filter(([e, _]) => !e.match)
            .map(([e, s]) => <div key={s}>
                <ExampleError example={e} str={s}/>
            </div>)
    }

    return <Tooltip2 content={tooltipContent()}>
        <Icon icon={IconNames.THUMBS_DOWN}
              intent={Intent.DANGER}/>
    </Tooltip2>
}

const SaidRow = React.memo((props: { project: string, said: ISaid, edit: (said: ISaid) => void }) => {
    const {project, said, edit} = props
    return <tr>
        <td>{said.index}</td>
        <td className="text-break">{said.expression}</td>
        <td><Button icon={IconNames.EDIT}
                    minimal
                    onClick={() => edit(said)}
        /></td>
        <td className="text-break"><SaidHighlight said={said}/></td>
        <td><SaidValidation said={said}/></td>
        <td>{said.prints && <Prints project={project} said={said}/>}</td>
        <td><ApproveButton project={project} said={said}/></td>
    </tr>
})

type R = {
    project: string,
    script: string
}

type State = {
    saids: ISaid[],
    synonyms: ISynonym[],
    edit: ISaid,
    wordA: string,
    wordB: string
}

@withRouter
export default class SaidsPage extends LoaderComponent<RouteProps<R>, State> {
    get project() {
        return this.props.match.params.project
    }

    get script() {
        return parseInt(this.props.match.params.script)
    }

    prepare(): Promise {
        this.setState({
            wordA: '',
            wordB: ''
        })
        return Promise.all([
            api.saids.get(this.project, this.script),
            api.synonyms.get(this.project, this.script)
        ]).then(([saids, synonyms]) => {
            this.setState({
                saids,
                synonyms
            })
        })
    }

    successRender() {
        const {saids, synonyms} = this.state
        return <>
            <SaidEditDialog said={this.state.edit}
                            project={this.project}
                            cancel={() => this.setState({edit: null})}
                            update={(s: ISaid) => {
                                saids[s.index] = s
                                this.setState({
                                    edit: null,
                                    saids: [...saids]
                                })
                            }}
            />
            <Table striped size="sm">
                <colgroup>
                    <col width="1%"/>
                    <col/>
                    <col width="1%"/>
                    <col/>
                    <col/>
                    <col width="1%"/>
                    <col width="1%"/>
                </colgroup>
                <tbody>
                {saids.map((said) => (
                    <SaidRow key={said.id}
                             project={this.project}
                             said={said}
                             edit={this.editHandle}
                    />))}
                </tbody>
            </Table>
            <H4>Synonyms</H4>
            <Table striped size="sm">
                <colgroup>
                    <col/>
                    <col/>
                    <col width="1%"/>
                </colgroup>
                <tbody>
                {synonyms.map((s) => <tr key={s.id} className={s.delete ? "line-through" : undefined}>
                    <td>{s.wordAStr}</td>
                    <td>{s.wordBStr}</td>
                    <td><Button icon={IconNames.TRASH}
                                intent={s.delete ? Intent.DANGER : Intent.NONE}
                                minimal
                                onClick={() => this.deleteSyn(s)}
                    /></td>
                </tr>)}
                <tr>
                    <td><InputGroup placeholder="user_input"
                                    value={this.state.wordA}
                                    onChange={(e) => this.setState({wordA: e.target.value})}
                    /></td>
                    <td><InputGroup placeholder="is_equal"
                                    value={this.state.wordB}
                                    onChange={(e) => this.setState({wordB: e.target.value})}
                    /></td>
                    <td><Button icon={IconNames.ADD}
                                intent={Intent.SUCCESS}
                                minimal
                                onClick={this.addSyn}
                    /></td>
                </tr>
                </tbody>
            </Table>
        </>
    }

    editHandle = (said: ISaid) => {
        this.setState({edit: said})
    }

    deleteSyn(syn: ISynonym) {
        if (syn.delete) {
            api.synonyms.restore(syn.id)
                .then(() => {
                    syn.delete = false
                    this.setState({
                        synonyms: [...this.state.synonyms]
                    })
                })
        } else {
            api.synonyms.delete(syn.id)
                .then(() => {
                    if (syn.index !== null) {
                        syn.delete = true
                        this.setState({
                            synonyms: [...this.state.synonyms]
                        })
                    } else {
                        this.setState({
                            synonyms: this.state.synonyms.filter((s) => s.id !== syn.id)
                        })
                    }
                })
        }
    }

    addSyn = () => {
        const {wordA, wordB} = this.state
        if (!wordA || !wordB) return

        api.synonyms.create(this.project, this.script, wordA, wordB)
            .then((syn) => {
                this.setState({
                    synonyms: [...this.state.synonyms, syn],
                    wordA: '',
                    wordB: ''
                })
            })
    }
}