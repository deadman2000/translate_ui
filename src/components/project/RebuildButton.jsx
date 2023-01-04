import React, {Component} from "react";
import {Button} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import api from "@/api/Api";
import {toast} from "@/components/AppToaster";
import type {IProject} from "@/model/IProject";

export default class RebuildButton extends Component<{ project: IProject }> {
    state = {
        loading: false
    }

    render() {
        return <Button icon={IconNames.BUILD}
                       text="Rebuild"
                       loading={this.state.loading}
                       onClick={this.reindex}/>
    }

    reindex = () => {
        this.setState({loading: true})
        api.project(this.props.project.code)
            .rebuild()
            .then(() => toast("Rebuilded"))
            .finally(() => this.setState({loading: false}))
    }
}