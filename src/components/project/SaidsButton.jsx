import api from "@/api/Api"
import {toast} from "@/components/AppToaster"
import type {IProject} from "@/model/IProject"
import {Button} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import React from "react"

export class SaidsButton extends React.Component<{ project: IProject }> {
    state = {
        loading: false
    }

    render() {
        return <Button icon={IconNames.REFRESH}
                       text="Setup saids"
                       loading={this.state.loading}
                       onClick={this.clickCallback}/>
    }

    clickCallback = () => {
        this.setState({loading: true})
        api.tools
            .setupSaids(this.props.project.code)
            .then(() => toast("Completed"))
            .finally(() => this.setState({loading: false}))
    }
}