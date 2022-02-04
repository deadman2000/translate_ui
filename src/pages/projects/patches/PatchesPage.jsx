import React from "react";
import {inject} from "mobx-react";
import {Container} from "react-bootstrap";
import {Route, Switch, withRouter} from "react-router-dom";
import {Button} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import PatchUploadPage from "@/pages/projects/patches/PatchUploadPage";
import {GlobalStore} from "@/stores/GlobalStore";
import type {RouteProps} from "@/types/RouteProps";

@inject("global")
@withRouter
class PatchesList extends React.Component<{global?: GlobalStore} & RouteProps> {
    render() {
        return <div>
            <Container className="pt-4">
                <div className="buttons-container">
                    <Button icon={IconNames.CLOUD_UPLOAD} text="Upload" onClick={this.uploadClick}/>
                </div>
            </Container>
        </div>
    }

    uploadClick = () => {
        this.props.history.push(`${this.props.match.url}/upload`)
    }
}

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