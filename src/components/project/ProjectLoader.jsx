import React from "react";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";

import api from "@/api/Api";
import type {IProject} from "@/model/IProject";
import type {RouteProps} from "@/types/RouteProps";
import ProjectViewPage from "@/pages/projects/ProjectViewPage";
import UploadingPage from "@/pages/projects/UploadingPage";
import VolumePage from "@/pages/projects/VolumePage";
import LoaderComponent from "@/components/LoaderComponent";
import {inject} from "mobx-react";
import {GlobalStore} from "@/stores/GlobalStore";

type R = {
    project: string
}

type States = {
    project: IProject
}

@inject("global")
@withRouter
export default class ProjectLoader extends LoaderComponent<{global?: GlobalStore} & RouteProps<R>, States> {
    prepare() {
        return api.projects.get(this.props.match.params.project)
            .then(project => {
                this.setState({project})
                this.props.global.setProject(project)
            })
    }

    componentWillUnmount() {
        this.props.global.setProject(null)
    }

    successRender() {
        const {path} = this.props.match
        const {project} = this.state

        if (!project)
            return <Redirect to="/projects"/>

        return <Switch>
            <Route exact path={path}>
                <ProjectViewPage project={project}/>
            </Route>
            <Route exact path={`${path}/upload`}>
                <UploadingPage project={project}/>
            </Route>
            <Route exact path={`${path}/:volume`}>
                <VolumePage />
            </Route>
        </Switch>
    }
}
