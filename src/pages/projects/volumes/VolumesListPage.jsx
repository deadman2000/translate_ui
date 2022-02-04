import React, {Component} from "react";
import {inject} from "mobx-react";
import {Container} from "react-bootstrap";

import DeleteButton from "@/components/project/DeleteButton";
import ReindexButton from "@/components/project/ReindexButton";
import VolumesList from "@/components/project/VolumesList";
import {GlobalStore} from "@/stores/GlobalStore";

@inject("global")
export default class VolumesListPage extends Component<{ global?: GlobalStore }> {
    render() {
        const project = this.props.global.project;

        return <div>
            <Container className="pt-4">
                <div className="buttons-container">
                    <ReindexButton project={project}/>
                    <DeleteButton project={project}/>
                </div>
            </Container>
            <VolumesList project={project}/>
        </div>
    }
}