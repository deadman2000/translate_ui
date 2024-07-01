import React, {Component} from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import type {RouteProps} from "@/types/RouteProps";
import InvitesPage from "@/pages/admin/InvitesPage";
import UsersPage from "@/pages/admin/UsersPage";
import VideosPage from "@/pages/admin/VideosPage";
import ChartPage from "@/pages/admin/ChartPage";

@withRouter
export default class AdminPage extends Component<{} & RouteProps> {
    render() {
        const {path} = this.props.match
        return <div className="content">
            <Switch>
                <Route path={`${path}/invites`}>
                    <InvitesPage/>
                </Route>
                <Route path={`${path}/users`} exact>
                    <UsersPage/>
                </Route>
                <Route path={`${path}/users/:id/chart`} exact>
                    <ChartPage/>
                </Route>
                <Route path={`${path}/users/:id/chart/:project`} exact>
                    <ChartPage/>
                </Route>
                <Route path={`${path}/videos`}>
                    <VideosPage/>
                </Route>
            </Switch>
        </div>
    }
}