import api from "@/api/Api"
import {ISaidScript} from "@/model/ISaidScript"
import {GlobalStore} from "@/stores/GlobalStore"
import React from "react"
import {inject} from "mobx-react"
import LoaderComponent from "@/components/LoaderComponent"
import {Container, Table} from "react-bootstrap"
import {Link} from "react-router-dom"

@inject("global")
export default class SaidScriptsPage extends LoaderComponent<{ global?: GlobalStore }, { scripts: ISaidScript[] }> {
    get project() {
        return this.props.global.project.code
    }

    prepare(): Promise {
        document.title = `Saids ${this.props.global.project.name}`;
        return api.saids.scripts(this.project)
            .then((scripts) => this.setState({scripts}))
    }

    successRender() {
        return <Container className="pt-2">
            <Table striped>
                <colgroup>
                    <col width="1%"/>
                    <col width="99%"/>
                    <col width="1%"/>
                </colgroup>
                <tbody>
                {this.state.scripts.map((s) => <tr key={s.script}>
                    <td><Link to={`saids/${s.script}`}>{s.script.toString().padStart(3, '0')}</Link></td>
                    <td className="align-middle">
                        {s.approved > 0 &&
                            <div className="progress">
                                <div className="progress-bar bg-success" role="progressbar"
                                     style={{width: (s.approved * 100 / s.count) + "%"}}/>
                            </div>}
                    </td>
                    <td>{s.approved}&nbsp;/&nbsp;{s.count}</td>
                </tr>)}
                </tbody>
            </Table>
        </Container>
    }
}