import React from "react";
import {Route, Switch, withRouter} from "react-router-dom";

import PatchUploadPage from "@/pages/projects/patches/PatchUploadPage";
import type {RouteProps} from "@/types/RouteProps";
import {PatchesList} from "@/components/patches/PatchesList";

@withRouter
export default class PatchesPage extends React.Component<{} & RouteProps> {
    render() {
        const {path} = this.props.match

        return <Switch>
            <Route exact path={path}>
                <PatchesList />
            </Route>
            <Route path={`${path}/upload`}>
                <PatchUploadPage />
            </Route>
        </Switch>
    }
}