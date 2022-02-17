import React from "react";
import LoaderComponent from "@/components/LoaderComponent";
import api from "@/api/Api";
import {Col, Container, Row, Table} from "react-bootstrap";
import {Button, FormGroup, Icon, InputGroup, Intent, ProgressBar} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import DeleteConfirmButton from "@/components/DeleteConfirmButton";
import type {IVideo} from "@/model/IVideo";

type States = {
    videos: IVideo[],
    link: string,
    videoId: string,
    project: string,
}

const re = /(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/

export default class VideosPage extends LoaderComponent<{}, States> {
    prepare(): Promise {
        const project = localStorage.getItem('video_last_project')
        this.setState({project})

        return api.video.list()
            .then((videos) => this.setState({videos}))
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
            <Table>
                <tbody>
                {this.state.videos.map(v => <tr key={v.id}>
                    <td><a href={`https://youtu.be/${v.videoId}`} target="_blank">{v.videoId}</a></td>
                    <td>{v.project}</td>
                    <td style={{minWidth: 200}}>{v.completed ?
                        <Icon icon={IconNames.TICK_CIRCLE} intent={Intent.SUCCESS} />
                        : v.framesCount > 0 ?
                            <ProgressBar value={v.framesProcessed/v.framesCount} />
                            : <Icon icon={IconNames.TIME} intent={Intent.PRIMARY} />}
                    </td>
                    <td><DeleteConfirmButton onConfirm={() => this.deleteVideo(v)} /></td>
                </tr>)}
                </tbody>
            </Table>
        </Container>
    }

    linkChange = (e) => {
        const link = e.target.value
        const match = re.exec(link)
        const videoId = match !== null ? match[2] : ''
        this.setState({link, videoId})
    }

    deleteVideo = (video: IVideo) => {
        api.video.delete(video)
            .then(() => {
                const i = this.state.videos.indexOf(video)
                this.state.videos.splice(i, 1)
                this.setState({videos: this.state.videos})
            })
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
        api.video.list()
            .then((videos) => this.setState({videos}))
    }
}