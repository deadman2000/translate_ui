import api from "@/api/Api"
import LoaderComponent from "@/components/LoaderComponent"
import type {ITextTr} from "@/model/ITextTr"
import {AnchorButton} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import React from "react"
import {Table} from "react-bootstrap"
import {withRouter} from "react-router-dom"

@withRouter
export class TranslatesByUser extends LoaderComponent<{},{list: ITextTr[]}> {
    prepare() {
        return api.project(this.props.match.params.project)
            .byUser(this.props.match.params.user)
            .then(list => {
                this.setState({list})
            })
    }

    successRender() {
        const {list} = this.state
        return <Table>
            <tbody>
            {list.map(tt => <tr key={tt.text.id}>
                <td>
                    {tt.text.text}
                </td>
                <td>
                    {tt.tr.text}
                </td>
                <td>
                    <AnchorButton
                        href={`/projects/${tt.text.project}/volumes/${tt.text.volume}#t${tt.text.number}`}
                        target="_blank"
                        icon={IconNames.SHARE}
                        minimal
                    />
                </td>
            </tr>)}
            </tbody>
        </Table>
    }
}