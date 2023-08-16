import React, {Component} from "react";
import {Button} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import api from "@/api/Api";
import {toast} from "@/components/AppToaster";
import type {IProject} from "@/model/IProject";

export default class ReindexButton extends Component<{ project: IProject }> {
    state = {
        loading: false
    }

    render() {
        return <Button icon={IconNames.REFRESH}
                       text="Reindex"
                       loading={this.state.loading}
                       onClick={this.clickCallback}/>
    }

    clickCallback = () => {
        this.setState({loading: true})
        api.project(this.props.project.code)
            .reindex()
            .then(() => toast("Reindexed"))
            .finally(() => this.setState({loading: false}))
    }
}