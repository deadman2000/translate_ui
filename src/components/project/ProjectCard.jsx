import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Card, Icon} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import type {RouteProps} from "@/types/RouteProps";
import type {IProject} from "@/model/IProject";


@withRouter
export default class ProjectCard extends Component<{project: IProject} & RouteProps> {
    render() {
        return <div className="project-card col-xs-12 col-sm-6 col-md-6 col-lg-4">
            <Card elevation={2} interactive
                  onClick={this.onClick}
            >
                <Icon icon={IconNames.PROJECTS}/> {this.props.project.name} <span>{this.props.project.status}</span>
            </Card>
        </div>
    }

    onClick = () => {
        this.props.history.push(`/projects/${this.props.project.code}`)
    }
}
