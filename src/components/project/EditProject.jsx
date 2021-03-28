import React, {Component} from "react";
import type {IProject} from "@/model/IProject";
import {Redirect} from "react-router-dom";

export default class EditProject extends Component<{project: IProject}> {
    render() {
        const {project} = this.props
        if (!project.uploaded)
            return <Redirect to={`/projects/${project.shortName}/upload`} />

        return <div>{project.name}</div>
    }
}