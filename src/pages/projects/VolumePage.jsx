import React from "react";
import {withRouter} from "react-router-dom";
import {Button, Table} from "react-bootstrap";

import api from "@/api/Api";
import type {RouteProps} from "@/types/RouteProps";
import type {ITextResource} from "@/model/ITextResource";
import LoaderComponent from "@/components/LoaderComponent";
import {TextArea} from "@blueprintjs/core";

type R = {
    project: string,
    volume: string
}

type States = {
    texts: ITextResource[]
}

@withRouter
export default class VolumePage extends LoaderComponent<RouteProps<R>, States> {
    constructor(props) {
        super(props);

        const {project, volume} = this.props.match.params
        this.texts = api.volumes(project).texts(volume)
    }

    prepare() {
        return this.texts.list()
            .then(texts => this.setState({texts}))
    }

    successRender() {
        const {project, volume} = this.props.match.params
        return <>
            <div>Project: {project} Volume: {volume}</div>
            <Table striped bordered>
                <tbody>
                    {this.state.texts.map(t => <tr key={t.number}>
                        <td style={{width: 40}}>{t.number}</td>
                        <td style={{width: "50%"}}>{t.text}</td>
                        <td style={{width: "50%"}}>
                            <div>
                                <TextArea fill />
                            </div>
                            <div style={{textAlign: "right", marginTop: 4}}>
                                <Button variant="danger" style={{marginRight: 16}}>Cancel</Button>
                                <Button variant="primary">SUBMIT</Button>
                            </div>
                        </td>
                    </tr>)}
                </tbody>
            </Table>
        </>
    }
}