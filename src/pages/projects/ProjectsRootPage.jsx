import React, {Component} from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import ProjectsListPage from "@/pages/projects/ProjectsListPage";
import CreateProjectPage from "@/pages/projects/CreateProjectPage";
import ProjectLoader from "@/components/project/ProjectLoader";
import type {RouteProps} from "@/types/RouteProps";

@withRouter
export default class ProjectsRootPage extends Component<{} & RouteProps> {
    render() {
        const {path} = this.props.match
        return <Switch>
            <Route exact path={path}>
                <ProjectsListPage/>
            </Route>
            <Route exact path={`${path}/create`}>
                <CreateProjectPage/>
            </Route>
            <Route path={`${path}/:project`}>
                <ProjectLoader/>
            </Route>
        </Switch>
    }
}