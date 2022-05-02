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


type R = {
    project: string,
    volume: string
}

type Props = {global?: GlobalStore} & RouteProps<R>

type States = {
    volume: IVolume,
    texts: ITextsResponse[]
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
            this.load()
    }

    componentWillUnmount() {
        this.props.global.setVolume({})
    }

    successRender() {
        return <>
            <TranslateHistory />
            <Table striped bordered className={"text-table " + (this.props.global.nonPrintShow ? "" : "hide-non-print")}>
                <tbody>
                    {this.state.texts.map(t => <TranslateRow key={t.source.number} text={t} />)}
                </tbody>
            </Table>
        </>
    }
}