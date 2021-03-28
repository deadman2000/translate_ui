import React, {Component} from "react";
import {Spinner} from "@blueprintjs/core";
import api from "@/api/Api";
import {Redirect, Route, RouteComponentProps, Switch, withRouter} from "react-router-dom";
import EditProject from "@/components/project/EditProject";
import {UploadingProject} from "@/components/project/UploadingProject";

@withRouter
export default class ProjectLoader extends Component<RouteComponentProps> {
    state = {
        loading: true,
        project: null,
    }

    componentDidMount() {
        api.projects.get(this.props.match.params['projectName'])
            .then(project => this.setState({project}))
            .finally(() => this.setState({loading: false}))
    }

    render() {
        const {path} = this.props.match
        const {loading, project} = this.state

        if (loading)
            return <Spinner />

        if (!project)
            return <Redirect to="/projects" />

        return <Switch>
            <Route exact path={path}>
                <EditProject project={project} />
            </Route>
            <Route exact path={`${path}/upload`}>
                <UploadingProject project={project} />
            </Route>
        </Switch>
    }
}
