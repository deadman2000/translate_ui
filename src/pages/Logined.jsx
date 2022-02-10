import AppNavbar from "@/components/AppNavbar";
import type {IMyInfo} from "@/model/IMyInfo";
import ProjectsRootPage from "@/pages/projects/ProjectsRootPage";
import AdminPage from "@/pages/admin/AdminPage";

import globalStore from "@/stores/GlobalStore";
import {Provider} from "mobx-react";
import React, {Component} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";

export default class Logined extends Component<{user: IMyInfo}> {
    componentDidMount() {
        globalStore.setUserInfo(this.props.user)
    }

    render() {
        return <>
            <Provider global={globalStore}>
                <Router>
                    <AppNavbar/>
                    <Switch>
                        <Route path="/projects">
                            <ProjectsRootPage/>
                        </Route>
                        <Route path="/admin">
                            <AdminPage/>
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