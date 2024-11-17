import api from "@/api/Api"
import DeleteButton from "@/components/project/DeleteButton"
import {TaskButton} from "@/components/project/TaskButton"
import {GlobalStore} from "@/stores/GlobalStore"
import user from "@/stores/UserInfo"
import {Card, FormGroup, H5, InputGroup, Switch} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import {inject} from "mobx-react"
import React from "react"
import {Container} from "react-bootstrap"
import {EncodingSelect} from "@/components/EncodingSelect";

type State = {
    shared: boolean,
    name: string,
    codePage: string
}

@inject("global")
export class SettingsPage extends React.Component<{ global?: GlobalStore }, State> {
    state : State = {
        shared: false,
        name: '',
        codePage: ''
    }

    componentDidMount() {
        const project = this.props.global.project;
        this.setState({
            shared: project.shared,
            name: project.name,
            codePage: project.codePage,
        })
        document.title = `Settings ${project.name}`
    }

    render() {
        if (!user.isAdmin) return null

        const project = this.props.global.project;
        return <Container>
            <Card className="m-3">
                <H5 className="flex-grow-1">Name</H5>
                <FormGroup>
                    <InputGroup id="name-input"
                                value={this.state.name}
                                onChange={e => this.setState({name: e.target.value})}
                    />
                </FormGroup>

                <H5 className="flex-grow-1">Encoding</H5>
                <FormGroup>
                    <EncodingSelect value={this.state.codePage}
                                    onChange={value => {
                                        console.log(value)
                                        this.setState({codePage: value})
                                    }}
                    />
                </FormGroup>

                <TaskButton text="Save"
                            icon={IconNames.FLOPPY_DISK}
                            action={() => api.project(project.code).update({
                                name: this.state.name,
                                codePage: this.state.codePage
                            })}
                />
            </Card>
            <Card className="m-3 d-flex">
                <Switch checked={this.state.shared} label="Shared" onChange={this.shareChanged}/>
            </Card>
            <Card className="m-3 d-flex">
                <H5 className="flex-grow-1">Reindex all text</H5>
                <TaskButton text="Reindex"
                            icon={IconNames.REFRESH}
                            action={() => api.project(project.code).reindex()}
                />
            </Card>
            {!project.hasSaid &&
            <Card className="m-3 d-flex">
                <H5 className="flex-grow-1">Extract parser</H5>
                <TaskButton text="Extract"
                            icon={IconNames.COMMENT}
                            action={() => api.tools.extractParser(project.code)}
                />
            </Card>}
            {project.hasSaid &&
                <Card className="m-3 d-flex">
                    <H5 className="flex-grow-1">Rebuild said hint's</H5>
                    <TaskButton text="Rebuild"
                                icon={IconNames.REFRESH}
                                action={() => api.tools.prints(project.code)}
                    />
                </Card>}
            <Card className="m-3 d-flex">
                <H5 className="flex-grow-1">Delete project</H5>
                <DeleteButton project={project}/>
            </Card>
        </Container>
    }

    shareChanged = (e) => {
        const val = e.target.checked
        api.project(this.props.global.project.code)
            .setShared(val)
            .then(() => {
                this.setState({
                    shared: val
                })
            })
    }
}