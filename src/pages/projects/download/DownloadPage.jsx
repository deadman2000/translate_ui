import user from "@/stores/UserInfo"
import React from "react";
import {Container, Table} from "react-bootstrap";
import {Icon} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {inject} from "mobx-react";
import {GlobalStore} from "@/stores/GlobalStore";
import './DownloadPage.scss'

@inject("global")
export default class DownloadPage extends React.Component<{global?: GlobalStore}> {
    render() {
        const project = this.props.global.project

        return <Container className="pt-4">
            <Table className="download-table">
                <tbody>
                    <tr>
                        <td><a href={`/api/projects/${project.code}/download/full`}><Icon icon={IconNames.ARCHIVE}/> Full game</a></td>
                    </tr>
                    <tr>
                        <td><a href={`/api/projects/${project.code}/download/patch`}><Icon icon={IconNames.ARCHIVE}/> Patch</a></td>
                    </tr>
                    <tr>
                        <td><a href={`/api/projects/${project.code}/download/source`}><Icon icon={IconNames.ARCHIVE}/> Source</a></td>
                        {user.isAdmin && (
                            <td><a href={`/projects/${project.code}/reupload`}><Icon icon={IconNames.UPLOAD}/> Replace source</a></td>
                        )}
                    </tr>
                </tbody>
            </Table>
        </Container>
    }
}