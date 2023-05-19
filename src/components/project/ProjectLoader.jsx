import api from "@/api/Api";
import LoaderComponent from "@/components/LoaderComponent";
import {TranslatesByUser} from "@/components/project/TranslatesByUser"
import {ProjectStatus} from "@/enum";
import type {IProject} from "@/model/IProject";
import ProjectTabContent from "@/pages/projects/ProjectTabContent";
import UploadingPage from "@/pages/projects/UploadingPage";
import SearchPage from "@/pages/SearchPage"
import {GlobalStore} from "@/stores/GlobalStore";
import type {RouteProps} from "@/types/RouteProps";
import {inject} from "mobx-react";
import React from "react";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";

type R = {
    project: string
}

type Props = {
    global?: GlobalStore
} & RouteProps<R>

type States = {
    project: IProject
}

@inject("global")
@withRouter
export default class ProjectLoader extends LoaderComponent<Props, States> {
    prepare() {
        return api.projects.get(this.props.match.params.project)
            .then(project => {
                this.setState({project})
                this.props.global.setProject(project)
            })
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.match.params.project !== this.props.match.params.project)
            this.load()
    }

    componentWillUnmount() {
        this.props.global.setProject(null)
    }

    successRender() {
        const {path} = this.props.match
        const {project} = this.state

        if (!project)
            return <Redirect to="/projects"/>

        if (project.status === ProjectStatus.NEW)
            return <UploadingPage project={project}/>

        return <Switch>
            <Route exact path={path}>
                <Redirect to={`${project.code}/volumes`}/>
            </Route>
            <Route path={`${path}/byuser/:user`}>
                <TranslatesByUser />
            </Route>
            <Route path={`${path}/search`}>
                <SearchPage />
            </Route>
            <Route path={`${path}/reupload`}>
                <UploadingPage project={project} />
            </Route>
            <Route path={`${path}/:tabid`}>
                <ProjectTabContent />
            </Route>
        </Switch>
    }
}
