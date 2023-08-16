import {PatchesList} from "@/components/patches/PatchesList";

import PatchUploadPage from "@/pages/projects/patches/PatchUploadPage";
import {PatchUploadZipPage} from "@/pages/projects/patches/PatchUploadZipPage"
import type {RouteProps} from "@/types/RouteProps";
import React from "react";
import {Route, Switch, withRouter} from "react-router-dom";

@withRouter
export default class PatchesPage extends React.Component<{} & RouteProps> {
    render() {
        const {path} = this.props.match

        return <Switch>
            <Route exact path={path}>
                <PatchesList/>
            </Route>
            <Route path={`${path}/upload`}>
                <PatchUploadPage/>
            </Route>
            <Route path={`${path}/upload_zip`}>
                <PatchUploadZipPage/>
            </Route>
        </Switch>
    }
}