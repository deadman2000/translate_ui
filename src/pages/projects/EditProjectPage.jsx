import React, {Component} from "react";
import type {IProject} from "@/model/IProject";
import {Redirect} from "react-router-dom";
import {ProjectStatus} from "@/enum";
import VolumesList from "@/components/project/VolumesList";

export default class EditProjectPage extends Component<{project: IProject}> {
    render() {
        const {project} = this.props
        if (project.status === ProjectStatus.NEW)
            return <Redirect to={`/projects/${project.code}/upload`} />

        return <div>
            <p>{project.name}</p>
            <p>{project.code}</p>
            <p>{project.status}</p>
            <VolumesList project={project}/>
        </div>
    }
}