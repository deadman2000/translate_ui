import React, {Component} from "react";
import {Switch} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import {GlobalStore} from "@/stores/GlobalStore";

@inject("global")
@observer
export class HintSwitch extends Component<{global?: GlobalStore}> {
    render() {
        return <Switch innerLabel="Hint" large inline style={{marginBottom: 0}}
                       onChange={this.changeHandle}
                       checked={this.props.global.hints}
        />
    }

    changeHandle = (e) => {
        this.props.global.setHints(e.target.checked)
    }
}