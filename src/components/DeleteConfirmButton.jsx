import React from "react";
import {Button, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

export default class DeleteConfirmButton extends React.Component<{ onConfirm: () => void }> {
    state = {
        deleteConfirm: false
    }

    render() {
        return <Button icon={this.state.deleteConfirm ? IconNames.TICK_CIRCLE : IconNames.TRASH} intent={Intent.DANGER}
                       minimal onClick={this.onClick}/>
    }

    onClick = () => {
        if (!this.state.deleteConfirm) {
            this.setState({deleteConfirm: true})
            return
        }

        this.props.onConfirm()
    }
}