import React, {Component} from "react";
import {Button, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import api from "@/api/Api";
import type {IProject} from "@/model/IProject";
import {toaster} from "@/components/AppToaster";

export default class DeleteButton extends Component<{ project: IProject }> {
    render() {
        return <Button icon={IconNames.TRASH}
                       intent={Intent.DANGER}
                       text="Delete"
                       onClick={this.clickCallback}/>
    }

    clickCallback = () => {
        toaster.show({
            message: "Remove project?",
            intent: Intent.WARNING,
            action: {
                text: "Yes",
                onClick: () => {
                    api.project(this.props.project.code)
                        .delete()
                        .then(() => location.reload())
                }
            }
        })
    }
}