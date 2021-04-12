import React, {Component} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {Provider} from "mobx-react";

import globalStore from "@/stores/GlobalStore";
import ProjectsRootPage from "@/pages/projects/ProjectsRootPage";
import AppNavbar from "@/components/AppNavbar";

export default class Logined extends Component<{}> {
    render() {
        return <>
            <Provider global={globalStore}>
                <Router>
                    <AppNavbar/>
                    <Switch>
                        <Route path="/projects">
                            <ProjectsRootPage/>
                        </Route>
                        <Route path="*">
                            <Redirect to="/projects"/>
                        </Route>
                    </Switch>
                </Router>
            </Provider>
        </>
    }
}