import React from "react";
import {Link, withRouter} from "react-router-dom";
import {H2} from "@blueprintjs/core";

import api from "@/api/Api";
import type {IProject} from "@/model/IProject";
import type {IVolume} from "@/model/IVolume";
import type {RouteProps} from "@/types/RouteProps";
import LoaderComponent from "@/components/LoaderComponent";

type States = {
    volumes: IVolume[]
}

@withRouter
export default class VolumesList extends LoaderComponent<{ project: IProject } & RouteProps, States> {
    prepare(): Promise {
        return api.volumes(this.props.project.code).list()
            .then(volumes => this.setState({volumes}))
    }

    successRender() {
        return <>
            <H2>Volumes</H2>
            {this.state.volumes.map(v => <p key={v.name}><Link to={`${this.props.match.url}/${v.code}`}>{v.name}</Link>
            </p>)}
        </>
    }
}