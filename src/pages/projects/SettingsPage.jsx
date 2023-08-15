import api from "@/api/Api"
import DeleteButton from "@/components/project/DeleteButton"
import ReindexButton from "@/components/project/ReindexButton"
import {GlobalStore} from "@/stores/GlobalStore"
import user from "@/stores/UserInfo"
import {Card, H5, Switch} from "@blueprintjs/core"
import {inject} from "mobx-react"
import React from "react"
import {Container} from "react-bootstrap"

@inject("global")
export class SettingsPage extends React.Component<{ global?: GlobalStore }> {
    state = {
        shared: false
    }

    componentDidMount() {
        const project = this.props.global.project;
        this.setState({
            shared: project.shared
        })
    }

    render() {
        if (!user.isAdmin) return null

        const project = this.props.global.project;
        return <Container>
            <Card className="m-3">
                <Switch checked={this.state.shared} label="Shared" onChange={this.shareChanged}/>
            </Card>
            <Card className="m-3 d-flex">
                <H5 className="flex-grow-1">Reindex all text</H5>
                <ReindexButton project={project}/>
            </Card>
            <Card className="m-3 d-flex">
                <H5 className="flex-grow-1">Delete project</H5>
                <DeleteButton project={project}/>
            </Card>
        </Container>
    }

    shareChanged = (e) => {
        api.project(this.props.global.project.code)
            .setShared(e.target.checked)
            .then(() => {
                this.setState({
                    shared: e.target.checked
                })
            })
    }
}