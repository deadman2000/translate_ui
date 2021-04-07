import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import type {RouteProps} from "@/types/RouteProps";
import type {IProject} from "@/model/IProject";

type R = {
    volume: string
}

@withRouter
export default class VolumePage extends Component<{project: IProject} & RouteProps<R>> {
    render() {
        return <div>Volume {this.props.match.params.volume}</div>
    }
}