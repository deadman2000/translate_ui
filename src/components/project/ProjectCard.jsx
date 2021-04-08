import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Card, Icon} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import type {RouteProps} from "@/types/RouteProps";
import type {IProject} from "@/model/IProject";
import ProjectCell from "@/components/project/ProjectCell";

@withRouter
export default class ProjectCard extends Component<{project: IProject} & RouteProps> {
    render() {
        return <ProjectCell>
            <Card elevation={2} interactive
                  onClick={this.onClick}
            >
                <Icon icon={IconNames.PROJECTS}/> {this.props.project.name} <span>{this.props.project.status}</span>
            </Card>
        </ProjectCell>
    }

    onClick = () => {
        this.props.history.push(`/projects/${this.props.project.code}`)
    }
}
