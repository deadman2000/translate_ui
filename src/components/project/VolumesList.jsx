import React from "react";
import {Link, withRouter} from "react-router-dom";
import {H2} from "@blueprintjs/core";

import api from "@/api/Api";
import type {IProject} from "@/model/IProject";
import type {IVolumeInfo} from "@/model/IVolumeInfo";
import type {RouteProps} from "@/types/RouteProps";
import LoaderComponent from "@/components/LoaderComponent";

type States = {
    volumes: IVolumeInfo[]
}

@withRouter
export default class VolumesList extends LoaderComponent<{ project: IProject } & RouteProps, States> {
    prepare(): Promise {
        return api.volumes(this.props.project.shortName).list()
            .then(volumes => this.setState({volumes}))
    }

    successRender() {
        return <>
            <H2>Volumes</H2>
            {this.state.volumes.map(v => <p key={v.name}><Link to={`${this.props.match.url}/${v.name}`}>{v.name}</Link>
            </p>)}
        </>
    }
}