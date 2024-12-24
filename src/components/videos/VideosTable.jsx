import React from "react";
import type {IVideo} from "@/model/IVideo";
import {Table} from "react-bootstrap";
import moment from "moment";
import {Button, Icon, Intent, ProgressBar} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import DeleteConfirmButton from "@/components/DeleteConfirmButton";
import api from "@/api/Api";

type Props = {
    videos: IVideo[]
}

type State = {
    videos: IVideo[]
}

function VideoProgress({video}: { video: IVideo }) {
    if (video.framesCount === 0)
        return <Icon icon={IconNames.TIME} intent={Intent.PRIMARY}/>

    if (video.completed)
        return <Icon icon={IconNames.TICK_CIRCLE} intent={Intent.SUCCESS}/>

    return <ProgressBar value={video.framesProcessed / video.framesCount}
                        animate={false}
                        intent={Intent.PRIMARY}
                        stripes={false}/>
}

export class VideosTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super();
        this.state = {
            videos: props.videos
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot) {
        if (this.props.videos !== prevProps.videos) {
            this.setState({videos: this.props.videos})
        }
    }

    render() {
        return <Table>
            <tbody>
            {this.state.videos.map(v => <tr key={v.id}>
                <td><a href={`https://youtu.be/${v.videoId}`} target="_blank">{v.videoId}</a></td>
                <td>
                    {!!v.framesCount && moment.utc((v.framesCount / v.fps) * 1000).format('HH:mm:ss')}
                </td>
                <td>{v.filters}</td>
                <td style={{minWidth: 200}}><VideoProgress video={v}/></td>
                <td>{v.completed && <Button minimal icon={IconNames.REFRESH} onClick={() => this.restart(v)}/>}</td>
                <td><DeleteConfirmButton onConfirm={() => this.deleteVideo(v)}/></td>
            </tr>)}
            </tbody>
        </Table>
    }

    restart = (video: IVideo) => {
        api.video.restart(video)
            .then(() => {
                api.video.list().then((videos) => this.setState({videos}))
            })
    }

    deleteVideo = (video: IVideo) => {
        api.video.delete(video)
            .then(() => {
                const i = this.state.videos.indexOf(video)
                this.state.videos.splice(i, 1)
                this.setState({videos: this.state.videos})
            })
    }
}