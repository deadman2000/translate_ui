import React, {Component} from "react";
import type {IProject} from "@/model/IProject";
import {Redirect} from "react-router-dom";
import {ProjectStatus} from "@/enum";

export default class EditProject extends Component<{project: IProject}> {
    render() {
        const {project} = this.props
        if (project.status === ProjectStatus.NEW)
            return <Redirect to={`/projects/${project.shortName}/upload`} />

        return <div>
            <p>{project.name}</p>
            <p>{project.shortName}</p>
            <p>{project.status}</p>
        </div>
    }
}