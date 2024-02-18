import React from "react";
import {withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {Table} from "react-bootstrap";

import api from "@/api/Api";
import type {RouteProps} from "@/types/RouteProps";
import type {ITextsResponse} from "@/model/ITextsResponse";
import type {IVolume} from "@/model/IVolume";
import {GlobalStore} from "@/stores/GlobalStore";
import LoaderComponent from "@/components/LoaderComponent";
import TranslateRow from "@/components/project/TranslateRow";
import TranslateHistory from "@/components/project/TranslateHistory";
import user from "@/stores/UserInfo";
import {EditableText} from "@blueprintjs/core";


type R = {
    project: string,
    volume: string
}

type Props = {global?: GlobalStore} & RouteProps<R>

type States = {
    volume: IVolume,
    texts: ITextsResponse[]
}

class DescriptionEditor extends React.Component<{volume: IVolume}> {
    render(){
        const {volume} = this.props
        return <div className="pl-3 pr-3 pt-1 pb-1">
            <EditableText defaultValue={volume.description}
                          onConfirm={this.rename}
            />
        </div>
    }

    rename = (value) => {
        const {volume} = this.props

        api.project(volume.project)
            .volume(volume.code)
            .update({description: value})
            .then()
    }
}

@withRouter
@inject("global")
@observer
export default class VolumePage extends LoaderComponent<Props, States> {
    prepare() {
        const {project, volume} = this.props.match.params
        const volumeApi = api.project(project).volume(volume)

        const loadVolume = volumeApi.get()
            .then(volume => {
                this.setState({volume})
                this.props.global.setVolume(volume)
            })

        const loadTexts = volumeApi.texts()
            .then(texts => {
                this.setState({texts})
                this.scrollToLocation()
            })

        document.title = `${volume} ${this.props.global.project.name}`;

        return Promise.all([loadVolume, loadTexts])
    }

    scrollToLocation() {
        const { hash } = location;
        if (hash !== '') {
            let retries = 0;
            const id = hash.replace('#', '');
            const scroll = () => {
                retries += 0;
                if (retries > 50) return;
                const element = document.getElementById(id);
                if (element) {
                    element.className += ' hash'
                    setTimeout(() => element.scrollIntoView(), 0);
                } else {
                    setTimeout(scroll, 100);
                }
            };
            scroll();
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<States>, snapshot) {
        if (prevProps.match.params.volume !== this.props.match.params.volume)
            this._load()
    }

    componentWillUnmount() {
        this.props.global.setVolume({})
    }

    successRender() {
        const {volume} = this.state
        return <>
            <TranslateHistory />
            {user.isAdmin
                ? <DescriptionEditor volume={volume} />
                : (!!volume.description && <div className="pl-3 pr-3 pt-1 pb-1">{volume.description}</div>)
            }
            <Table striped bordered className={"text-table " + (this.props.global.nonPrintShow ? "" : "hide-non-print")}>
                <tbody>
                    {this.state.texts.map(t => <TranslateRow key={t.source.number} text={t} />)}
                </tbody>
            </Table>
        </>
    }
}