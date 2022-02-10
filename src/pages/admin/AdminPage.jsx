import React, {Component} from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import type {RouteProps} from "@/types/RouteProps";
import InvitesPage from "@/pages/admin/InvitesPage";

@withRouter
export default class AdminPage extends Component<{} & RouteProps> {
    render() {
        const {path} = this.props.match
        return <div className="content">
            <Switch>
                {/*<Route exact path={path}>*/}
                {/*    <ProjectsListPage/>*/}
                {/*</Route>*/}
                <Route exact path={`${path}/invites`}>
                    <InvitesPage/>
                </Route>
            </Switch>
        </div>
    }
}