import React from "react";
import LoaderComponent from "@/components/LoaderComponent";
import api from "@/api/Api";
import {Col, Container, Row} from "react-bootstrap";
import {Button, FormGroup, InputGroup, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import type {IVideo} from "@/model/IVideo";
import type {IRunner} from "@/model/IRunner";
import {VideosTable} from "@/components/videos/VideosTable";
import {RunnersTable} from "@/components/videos/RunnersTable";

type States = {
    videos: IVideo[],
    runners: IRunner[],
    link: string,
    videoId: string,
    project: string,
}

const re = /(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/

export default class VideosPage extends LoaderComponent<{}, States> {
    load() {
        const loadVideos = api.video.list().then((videos) => this.setState({videos}))
        const loadRunners = api.video.runners().then((runners) => this.setState({runners}))
        return Promise.all([loadVideos, loadRunners])
    }

    prepare(): Promise {
        const project = localStorage.getItem('video_last_project')
        this.setState({project})
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
                            <FormGroup label="Project" labelFor="project">
                                <InputGroup id="project"
                                            onChange={e => this.setState({project: e.target.value})}
                                            value={this.state.project}/>
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
            <RunnersTable runners={this.state.runners}/>
        </Container>
    }

    linkChange = (e) => {
        const link = e.target.value
        const match = re.exec(link)
        const videoId = match !== null ? match[2] : ''
        this.setState({link, videoId})
    }

    addVideo = () => {
        const {videoId, project} = this.state
        if (!videoId || !project) return

        localStorage.setItem('video_last_project', project)

        api.video.create({ videoId, project })
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
}