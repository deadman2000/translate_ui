import SearchPage from "@/pages/SearchPage"
import React, {Component} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {Provider} from "mobx-react";

import globalStore from "@/stores/GlobalStore";
import AppNavbar from "@/components/AppNavbar";
import ProjectsRootPage from "@/pages/projects/ProjectsRootPage";
import AdminPage from "@/pages/admin/AdminPage";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import NotifyPage from "@/pages/NotifyPage";

export default class AuthSwitch extends Component<{}> {
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
                        <Route path="/notify">
                            <NotifyPage/>
                        </Route>
                        <Route path="/search">
                            <SearchPage/>
                        </Route>
                        <Route path="*">
                            <Redirect to="/projects"/>
                        </Route>
                    </Switch>
                    <ChangePasswordDialog />
                </Router>
            </Provider>
        </>
    }
}