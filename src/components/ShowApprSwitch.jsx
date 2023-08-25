import React, {Component} from "react";
import {Switch} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import {GlobalStore} from "@/stores/GlobalStore";

@inject("global")
@observer
export class ShowApprSwitch extends Component<{global?: GlobalStore}> {
    render() {
        return <Switch innerLabel="Appr" large inline style={{marginBottom: 0}}
                       onChange={this.changeHandle}
                       checked={this.props.global.showAppr}
        />
    }

    changeHandle = (e) => {
        this.props.global.setShowAppr(e.target.checked)
    }
}