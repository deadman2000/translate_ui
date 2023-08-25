import React, {Component} from "react";
import {Switch} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import {GlobalStore} from "@/stores/GlobalStore";

@inject("global")
@observer
export class ShowUntrSwitch extends Component<{global?: GlobalStore}> {
    render() {
        return <Switch innerLabel="Not tr" large inline style={{marginBottom: 0}}
                       onChange={this.changeHandle}
                       checked={this.props.global.showUntr}
        />
    }

    changeHandle = (e) => {
        this.props.global.setShowUntr(e.target.checked)
    }
}