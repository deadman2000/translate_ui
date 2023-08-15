import React, {Component} from "react";
import {inject} from "mobx-react";

import VolumesList from "@/components/project/VolumesList";
import {GlobalStore} from "@/stores/GlobalStore";

@inject("global")
export default class VolumesListPage extends Component<{ global?: GlobalStore }> {
    render() {
        const project = this.props.global.project;
        return <>
            <VolumesList project={project}/>
        </>
    }
}