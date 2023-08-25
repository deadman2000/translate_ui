import {toast} from "@/components/AppToaster"
import {Button} from "@blueprintjs/core"
import {IconName} from "@blueprintjs/icons"
import React from "react"

type Props = {
    icon: IconName,
    text: string,
    action: () => Promise
}

export class TaskButton extends React.Component<Props> {
    state = {
        loading: false
    }

    render() {
        return <Button icon={this.props.icon}
                       text={this.props.text}
                       loading={this.state.loading}
                       onClick={this.clickCallback}/>
    }

    clickCallback = () => {
        this.setState({loading: true})
        this.props.action()
            .then(() => toast("Completed"))
            .finally(() => this.setState({loading: false}))
    }
}