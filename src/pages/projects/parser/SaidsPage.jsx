import api from "@/api/Api"
import LoaderComponent from "@/components/LoaderComponent"
import type {ISaid} from "@/model/ISaid"
import {SaidEditDialog} from "@/pages/projects/parser/SaidEditDialog"
import type {RouteProps} from "@/types/RouteProps"
import {Button, Intent} from "@blueprintjs/core"
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
        <td>{said.examples && said.examples.map((s) => <div key={s}>{s}</div>)}</td>
        <td>{said.prints && <Prints project={project} said={said}/>}</td>
        <td><ApproveButton project={project} said={said}/></td>
    </tr>
})

type R = {
    project: string,
    script: string
}

@withRouter
export default class SaidsPage extends LoaderComponent<RouteProps<R>, { saids: ISaid[], edit: ISaid }> {
    get project() {
        return this.props.match.params.project
    }

    get script() {
        return parseInt(this.props.match.params.script)
    }

    prepare(): Promise {
        return api.saids.get(this.project, this.script)
            .then((saids) => this.setState({saids}))
    }

    successRender() {
        const {saids} = this.state
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
        </>
    }

    editHandle = (said: ISaid) => {
        this.setState({edit: said})
    }
}