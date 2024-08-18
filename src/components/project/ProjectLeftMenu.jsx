import api from "@/api/Api"
import {GlobalStore} from "@/stores/GlobalStore"
import user from "@/stores/UserInfo"
import {Icon, Intent, Tag} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import type {RouteProps} from "@/types/RouteProps"
import {inject} from "mobx-react"
import React, {Component, useEffect, useState} from "react";
import {Container, Row} from "react-bootstrap"
import {Link, withRouter} from "react-router-dom"


type R = {
    project: string,
    tabid: string
}

function SpellCounter(props: { project: string }) {
    const [count, setCount] = useState()
    useEffect(() => {
        api.spellcheck.total(props.project)
            .then((response) => {
                setCount(response.total)
            })
    }, [])
    if (!count) return null
    return <Tag round intent={Intent.DANGER}>{count}</Tag>
}

@withRouter
class LMenuItem extends Component<{ icon: any, tab: any, children: any } & RouteProps<R>> {
    render() {
        const {icon, tab, children} = this.props
        const {project, tabid} = this.props.match.params
        return <li className="bp4-tab pb-1" role="tab" aria-selected={tabid === tab}>
            <Link className="px-2 text-truncate" to={`/projects/${project}/${tab}`}>
                <Icon icon={icon}/>
                <span className="pl-1 d-none d-sm-inline">{children}</span>
            </Link>
        </li>
    }
}

@withRouter
@inject("global")
export default class ProjectLeftMenu extends Component<{ global?: GlobalStore } & RouteProps<R>> {
    render() {
        const project = this.props.global.project

        return <Container fluid className="h-100 left-menu">
            <Row className="h-100">
                <aside className="col-sm-2 sticky-top pb-sm-0 pb-3 pl-0 pt-2 bp4-elevation-2 bg-white">
                    <div className="bp4-tabs bp4-vertical-custom">
                        <ul className="bp4-tab-list flex-sm-column flex-row mb-auto justify-content-between text-truncate"
                            role="tablist">
                            <LMenuItem icon={IconNames.BOOK} tab="volumes">
                                Volumes
                            </LMenuItem>
                            {project.hasSaid && (<>
                                <LMenuItem icon={IconNames.LABEL} tab="words">
                                    Words
                                </LMenuItem>
                                <LMenuItem icon={IconNames.REGEX} tab="suffixes">
                                    Suffixes
                                </LMenuItem>
                                <LMenuItem icon={IconNames.CHAT} tab="saids">
                                    Saids
                                </LMenuItem>
                            </>)}
                            <LMenuItem icon={IconNames.CLOUD_UPLOAD} tab="patches">
                                Patches
                            </LMenuItem>
                            <LMenuItem icon={IconNames.DOWNLOAD} tab="download">
                                Download
                            </LMenuItem>
                            <LMenuItem icon={IconNames.SPELL_CHECK} tab="spellcheck">
                                Spelling <SpellCounter project={this.props.match.params.project}/>
                            </LMenuItem>
                            <LMenuItem icon={IconNames.SEARCH} tab="search">
                                Search
                            </LMenuItem>
                            <LMenuItem icon={IconNames.TICK} tab="validate">
                                Validate
                            </LMenuItem>
                            {user.isAdmin && <>
                                <LMenuItem icon={IconNames.SEARCH_TEXT} tab="replace">
                                    Replace
                                </LMenuItem>
                                <LMenuItem icon={IconNames.IMPORT} tab="import">
                                    Import
                                </LMenuItem>
                                <LMenuItem icon={IconNames.WRENCH} tab="settings">
                                    Settings
                                </LMenuItem>
                            </>}
                        </ul>
                    </div>
                </aside>
                <main className="col overflow-auto h-100">
                    {this.props.children}
                </main>
            </Row>
        </Container>
    }
}