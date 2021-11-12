import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {Container} from "react-bootstrap";
import {Button, Intent, Switch} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import api from "@/api/Api";
import {ProjectStatus} from "@/enum";
import type {IProject} from "@/model/IProject";
import VolumesList from "@/components/project/VolumesList";
import {toast, toaster} from "@/components/AppToaster";
import {GlobalStore} from "@/stores/GlobalStore";
import {inject, observer} from "mobx-react";

class ReindexButton extends Component<{project: IProject}> {
    state = {
        loading: false
    }

    render() {
        return <Button icon={IconNames.REFRESH}
                       text="Reindex"
                       loading={this.state.loading}
                       onClick={this.reindex} />
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
                       intent={Intent.DANGER}
                       text="Delete"
                       onClick={this.handleClick} />
    }

    handleClick = () => {
        toaster.show({
            message: "Remove project?",
            intent: Intent.WARNING,
            action: {
                text: "Yes",
                onClick: () => {
                    api.project(this.props.project.code)
                        .delete()
                        .then(() => location.reload())
                }
            }
        })
    }
}

@inject("global")
@observer
export default class ProjectViewPage extends Component<{project: IProject, global?: GlobalStore}> {
    render() {
        const {project, global} = this.props
        if (project.status === ProjectStatus.NEW)
            return <Redirect to={`/projects/${project.code}/upload`} />

        return <div>
            <Container className="pt-4 buttons-container">
                <ReindexButton project={project}/>
                <DeleteButton project={project}/>
                <Switch inline label="Show completed" checked={global.showCompletedVolumes}
                        onChange={() => {
                            global.setVisibleCompletedVolumes(!global.showCompletedVolumes)
                        }}
                />
            </Container>
            <VolumesList project={project}/>
        </div>
    }
}