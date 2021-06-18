import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {Container} from "react-bootstrap";
import {Button} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import api from "@/api/Api";
import {ProjectStatus} from "@/enum";
import type {IProject} from "@/model/IProject";
import VolumesList from "@/components/project/VolumesList";
import {toast} from "@/components/AppToaster";

class ReindexButton extends Component<{project: IProject}> {
    state = {
        loading: false
    }

    render() {
        return <Button icon={IconNames.REFRESH}
                       text="Reindex"
                       loading={this.state.loading}
                       onClick={this.reindex} />;
    }

    reindex = () => {
        this.setState({loading: true})
        api.project(this.props.project.code)
            .reindex()
            .then(() => toast("Reindexed"))
            .finally(() => this.setState({loading: false}))
    }
}

class DeleteButton extends Component<{project: IProject}> {
    render() {
        return <Button icon={IconNames.TRASH}
                       text="Delete"
                       onClick={this.handleClick} />;
    }

    handleClick = () => {
        api.project(this.props.project.code)
            .delete()
            .then(() => location.reload())
    }
}

export default class ProjectViewPage extends Component<{project: IProject}> {
    render() {
        const {project} = this.props
        if (project.status === ProjectStatus.NEW)
            return <Redirect to={`/projects/${project.code}/upload`} />

        return <div>
            <Container>
                <ReindexButton project={project}/>
                <DeleteButton project={project}/>
            </Container>
            <VolumesList project={project}/>
        </div>
    }
}