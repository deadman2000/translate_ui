import React from "react";
import {withRouter} from "react-router-dom";
import type {RouteProps} from "@/types/RouteProps";
import api from "@/api/Api";
import LoaderComponent from "@/components/LoaderComponent";
import type {ITextResource} from "@/model/ITextResource";

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
        //const {project, volume} = this.props.match.params
        //this.texts = api.volumes(project).texts(volume)

        return this.texts.list()
            .then(texts => this.setState({texts}))
    }

    successRender() {
        const {project, volume} = this.props.match.params
        return <>
            <div>Project: {project} Volume: {volume}</div>
            <table>
                <tbody>
                    {this.state.texts.map(t => <tr key={t.number}>
                        <td>{t.number}</td>
                        <td>{t.text}</td>
                    </tr>)}
                </tbody>
            </table>
        </>
    }
}