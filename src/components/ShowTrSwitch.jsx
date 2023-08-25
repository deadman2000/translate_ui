import React, {Component} from "react";
import {Switch} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import {GlobalStore} from "@/stores/GlobalStore";

@inject("global")
@observer
export class ShowTrSwitch extends Component<{global?: GlobalStore}> {
    render() {
        return <Switch innerLabel="Tr" large inline style={{marginBottom: 0}}
                       onChange={this.changeHandle}
                       checked={this.props.global.showTr}
        />
    }

    changeHandle = (e) => {
        this.props.global.setShowTr(e.target.checked)
    }
}