import React, {Component} from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import VolumePage from "@/pages/projects/volumes/VolumePage";
import VolumesListPage from "@/pages/projects/volumes/VolumesListPage";
import type {RouteProps} from "@/types/RouteProps";

type R = {
}

@withRouter
export default class VolumesPage extends Component<{} & RouteProps<R>> {
    render() {
        const {path} = this.props.match

        return <Switch>
            <Route exact path={path}>
                <VolumesListPage />
            </Route>
            <Route path={`${path}/:volume`}>
                <VolumePage />
            </Route>
        </Switch>
    }
}