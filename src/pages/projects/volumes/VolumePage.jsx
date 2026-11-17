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
import {Button, EditableText} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {HintSwitch} from "@/components/HintSwitch";
import {ShowUntrSwitch} from "@/components/ShowUntrSwitch";
import {ShowTrSwitch} from "@/components/ShowTrSwitch";
import {ShowApprSwitch} from "@/components/ShowApprSwitch";
import {NonprintSwitch} from "@/components/NonprintSwitch";


type R = {
    project: string,
    volume: string
}

type Props = {global?: GlobalStore} & RouteProps<R>

type States = {
    volume: IVolume,
    texts: ITextsResponse[],
    adding: boolean,
    editNumber: ?number,
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
        if (prevProps.match.params.volume !== this.props.match.params.volume) {
            this.setState({editNumber: null, adding: false})
            this._load()
        }
    }

    componentWillUnmount() {
        this.props.global.setVolume({})
    }

    addText = () => {
        if (this.state.adding) return
        const {project, volume} = this.props.match.params
        this.setState({adding: true})
        api.project(project).volume(volume).createText("")
            .then(item => {
                this.setState(state => ({
                    texts: [...state.texts, item],
                    editNumber: item.source.number
                }))
            })
            .finally(() => this.setState({adding: false}))
    }

    removeText = (number) => {
        this.setState(state => ({
            texts: state.texts.filter(item => item.source.number !== number),
            editNumber: state.editNumber === number ? null : state.editNumber
        }))
    }

    successRender() {
        const {volume} = this.state
        return <>
            <TranslateHistory />
            {user.isAdmin
                ? <DescriptionEditor volume={volume} />
                : (!!volume.description && <div className="pl-3 pr-3 pt-1 pb-1">{volume.description}</div>)
            }
            <div className="pl-3 pb-1 d-none d-md-block d-lg-none">
                <HintSwitch/>
                <ShowUntrSwitch/>
                <ShowTrSwitch/>
                <ShowApprSwitch/>
                <NonprintSwitch/>
            </div>
            <Table striped bordered className={"text-table " + (this.props.global.nonPrintShow ? "" : "hide-non-print")}>
                <tbody>
                    {this.state.texts.map(t => <TranslateRow key={t.source.number}
                                                             text={t}
                                                             editSource={t.source.userText && this.state.editNumber === t.source.number}
                                                             onDeleted={() => this.removeText(t.source.number)} />)}
                    {user.isAdmin &&
                        <tr>
                            <td colSpan={5} className="volume-add-text">
                                <Button icon={IconNames.PLUS}
                                        minimal
                                        small
                                        title="Add text"
                                        loading={this.state.adding}
                                        onClick={this.addText}
                                />
                            </td>
                        </tr>
                    }
                </tbody>
            </Table>
        </>
    }
}