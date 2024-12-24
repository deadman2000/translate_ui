import React from "react";
import LoaderComponent from "@/components/LoaderComponent";
import api from "@/api/Api";
import {Col, Container, Row} from "react-bootstrap";
import {Button, FormGroup, InputGroup, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import type {IVideo} from "@/model/IVideo";
import type {IRunner} from "@/model/IRunner";
import {VideosTable} from "@/components/videos/VideosTable";
import {inject} from "mobx-react";
import {GlobalStore} from "@/stores/GlobalStore";

type States = {
    videos: IVideo[],
    runners: IRunner[],
    link: string,
    videoId: string,
    filters: string,
}

const re = /(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/

@inject("global")
export default class VideosPage extends LoaderComponent<{ global?: GlobalStore }, States> {
    get project() {
        return this.props.global.project.code
    }

    load() {
        return api.video.byProject(this.project).then((videos) => this.setState({videos}))
    }

    prepare(): Promise {
        this.setState({
            filters: 'h_600:thresh:unsharp'
        })
        return this.load()
    }

    successRender() {
        return <Container>
            <div className="mt-2 mb-2">
                <Container fluid>
                    <Row>
                        <Col>
                            <FormGroup label="Video link" labelFor="link">
                                <InputGroup id="link"
                                            onChange={this.linkChange}
                                            value={this.state.link}/>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup label="Filters" labelFor="filters">
                                <InputGroup id="filters"
                                            onChange={e => this.setState({filters: e.target.value})}
                                            value={this.state.filters}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            Video ID: {this.state.videoId}
                        </Col>
                        <Col>
                            <Button icon={IconNames.PLUS}
                                    text="ADD"
                                    intent={Intent.PRIMARY}
                                    onClick={this.addVideo} />
                            <Button icon={IconNames.REFRESH}
                                    text="REFRESH"
                                    className="ml-2"
                                    onClick={this.refresh} />
                        </Col>
                    </Row>
                </Container>
            </div>
            <VideosTable videos={this.state.videos}/>
        </Container>
    }

    linkChange = (e) => {
        const link = e.target.value
        const match = re.exec(link)
        const videoId = match !== null ? match[2] : ''
        this.setState({link, videoId})
    }

    addVideo = () => {
        const {videoId, filters} = this.state
        if (!videoId) return

        api.video.create({ videoId, project: this.project, filters })
            .then((video) => {
                this.state.videos.push(video)
                this.setState({
                    videos: this.state.videos,
                    link: '',
                    videoId: '',
                })
            })
    }

    refresh = () => {
        return this.load()
    }

    deleteRunner = (runner: IRunner) => {
        api.video.deleteRunner(runner)
            .then(() => {
                const i = this.state.runners.indexOf(runner)
                this.state.runners.splice(i, 1)
                this.setState({runners: this.state.runners})
            })
    }
}