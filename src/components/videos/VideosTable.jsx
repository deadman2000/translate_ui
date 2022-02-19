import React from "react";
import type {IVideo} from "@/model/IVideo";
import {Table} from "react-bootstrap";
import moment from "moment";
import {Icon, Intent, ProgressBar} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import DeleteConfirmButton from "@/components/DeleteConfirmButton";
import api from "@/api/Api";

type Props = {
    videos: IVideo[]
}

type State = {
    videos: IVideo[]
}

export class VideosTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super();
        this.state = {
            videos: props.videos
        }
    }

    render() {
        return <Table>
            <tbody>
            {this.state.videos.map(v => <tr key={v.id}>
                <td><a href={`https://youtu.be/${v.videoId}`} target="_blank">{v.videoId}</a></td>
                <td>{v.project}</td>
                <td>
                    {!!v.framesCount && moment.utc((v.framesCount / v.fps) * 1000).format('HH:mm:ss')}
                </td>
                <td style={{minWidth: 200}}>{v.completed ?
                    <Icon icon={IconNames.TICK_CIRCLE} intent={Intent.SUCCESS}/>
                    : v.framesCount > 0 ?
                        <ProgressBar value={v.framesProcessed / v.framesCount}/>
                        : <Icon icon={IconNames.TIME} intent={Intent.PRIMARY}/>}
                </td>
                <td><DeleteConfirmButton onConfirm={() => this.deleteVideo(v)}/></td>
            </tr>)}
            </tbody>
        </Table>
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