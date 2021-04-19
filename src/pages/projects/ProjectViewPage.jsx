import React, {Component} from "react";
import type {IProject} from "@/model/IProject";
import {Redirect} from "react-router-dom";
import {ProjectStatus} from "@/enum";
import VolumesList from "@/components/project/VolumesList";
import {Button} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {toast} from "@/components/AppToaster";
import api from "@/api/Api";

export default class ProjectViewPage extends Component<{project: IProject}> {
    render() {
        const {project} = this.props
        if (project.status === ProjectStatus.NEW)
            return <Redirect to={`/projects/${project.code}/upload`} />

        return <div>
            <Button icon={IconNames.REFRESH} text="Reindex" onClick={() => api.project(project.code).reindex().then(() => toast("Reindexed"))} />
            <VolumesList project={project}/>
        </div>
    }
}