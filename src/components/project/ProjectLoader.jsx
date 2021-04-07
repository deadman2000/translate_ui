import React from "react";
import api from "@/api/Api";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";

import type {IProject} from "@/model/IProject";
import type {RouteProps} from "@/types/RouteProps";
import EditProjectPage from "@/pages/projects/EditProjectPage";
import {UploadingPage} from "@/pages/projects/UploadingPage";
import VolumePage from "@/pages/projects/VolumePage";
import LoaderComponent from "@/components/LoaderComponent";

type R = {
    projectName: string
}

type States = {
    project: IProject
}

@withRouter
export default class ProjectLoader extends LoaderComponent<RouteProps<R>, States> {
    prepare() {
        return api.projects.get(this.props.match.params.projectName)
            .then(project => this.setState({project}))
    }

    successRender() {
        const {path} = this.props.match
        const {project} = this.state

        if (!project)
            return <Redirect to="/projects"/>

        return <Switch>
            <Route exact path={path}>
                <EditProjectPage project={project}/>
            </Route>
            <Route exact path={`${path}/upload`}>
                <UploadingPage project={project}/>
            </Route>
            <Route exact path={`${path}/:volume`}>
                <VolumePage project={project}/>
            </Route>
        </Switch>
    }
}
