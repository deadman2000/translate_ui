import api from "@/api/Api"
import user from "@/stores/UserInfo"
import type {RouteProps} from "@/types/RouteProps";
import {Alignment, Navbar, Tab, TabId, Tabs} from "@blueprintjs/core";
import React, {Component, useEffect, useState} from "react";
import {withRouter} from "react-router-dom";

type R = {
    project: string,
    tabid: string
}

function SpellCounter(props: {project: string}) {
    const [count, setCount] = useState()
    useEffect(() => {
        api.spellcheck.total(props.project)
            .then((response) => {
                setCount(response.total)
            })
    }, [])
    return <>{count}</>
}

@withRouter
export class ProjectTabs extends Component<{} & RouteProps<R>> {
    render() {
        return (
            <Navbar.Group align={Alignment.LEFT} style={{marginLeft: 16}}>
                <Tabs id="navbar" animate large
                      onChange={this.projectTabChanged}
                      selectedTabId={this.props.match.params.tabid}
                >
                    <Tab id="volumes" title="Volumes"/>
                    <Tab id="patches" title="Patches"/>
                    <Tab id="download" title="Download"/>
                    <Tab id="spellcheck" title="Spelling" tagContent={<SpellCounter project={this.props.match.params.project}/>} tagProps={{round: true}}/>
                    {user.isAdmin && <Tab id="replace" title="Replace"/>}
                    {user.isAdmin && <Tab id="import" title="Import"/>}
                </Tabs>
            </Navbar.Group>
        )
    }

    projectTabChanged = (newTabId: TabId) => {
        let {project} = this.props.match.params
        this.props.history.push(`/projects/${project}/${newTabId}`)
    }
}