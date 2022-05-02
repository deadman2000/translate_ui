import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import {GlobalStore} from "@/stores/GlobalStore";
import {Button} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

@inject("global")
@observer
export class NonprintSwitch extends Component<{global?: GlobalStore}> {
    render() {
        return <Button icon={IconNames.PARAGRAPH} outlined
                       onClick={this.clickHandle}
                       active={this.props.global.nonPrintShow}
        />
    }

    clickHandle = () => {
        this.props.global.setShowNonPrint(!this.props.global.nonPrintShow)
    }
}