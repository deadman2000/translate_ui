import React, {Component} from "react";
import {Route, Switch, withRouter, RouteComponentProps} from "react-router-dom";
import ProjectsList from "@/components/project/ProjectsList";
import CreateProject from "@/components/project/CreateProject";
import ProjectLoader from "@/components/project/ProjectLoader";

@withRouter
export default class ProjectsSwitch extends Component<{} & RouteComponentProps> {
    render() {
        const {path} = this.props.match
        return <Switch>
            <Route exact path={path}>
                <ProjectsList />
            </Route>
            <Route exact path={`${path}/create`}>
                <CreateProject />
            </Route>
            <Route path={`${path}/:projectName`}>
                <ProjectLoader />
            </Route>
        </Switch>
    }
}