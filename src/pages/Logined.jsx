import React, {Component} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import ProjectsRootPage from "@/pages/projects/ProjectsRootPage";

export default class Logined extends Component<{}> {
    render() {
        return <Router>
            <Switch>
                <Route path="/projects">
                    <ProjectsRootPage/>
                </Route>
                <Route path="*">
                    <Redirect to="/projects"/>
                </Route>
            </Switch>
        </Router>
    }
}