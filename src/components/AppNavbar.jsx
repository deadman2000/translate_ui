import React, {Component} from "react";
import {Link, Route, Switch, withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {
    Alignment,
    Breadcrumb,
    Breadcrumbs,
    BreadcrumbProps,
    Button,
    Icon,
    Menu,
    MenuItem,
    Navbar,
    Position, Tab,
    Tabs,
    TabId
} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {Popover2} from "@blueprintjs/popover2";

import api from "@/api/Api";
import type {RouteProps} from "@/types/RouteProps";
import {GlobalStore} from "@/stores/GlobalStore";
import Search from "@/components/project/Search";


function breadcrumbRenderer({ text, href, icon }: IBreadcrumbProps) {
    if (href)
        return <Link className="bp3-breadcrumb" to={href}><Icon icon={icon}/> {text}</Link>
    return <Breadcrumb text={text} icon={icon}/>
}

type R = {
    project: string,
    tabid: string
}

@withRouter
class ProjectTabs extends Component<{} & RouteProps<R>> {
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
                </Tabs>
            </Navbar.Group>
        )
    }

    projectTabChanged = (newTabId: TabId) => {
        let {project} = this.props.match.params
        this.props.history.push(`/projects/${project}/${newTabId}`)
    }
}

@withRouter
@inject("global")
@observer
export default class AppNavbar extends Component<{global?: GlobalStore} & RouteProps<R>> {
    render() {
        const menu = <Menu>
            <MenuItem text="Invites" onClick={this.invites}/>
            <MenuItem text="Logout" onClick={this.logout}/>
        </Menu>

        return <Navbar fixedToTop>
            <Navbar.Group align={Alignment.LEFT}>
                <Breadcrumbs items={this.breadcrumbs()}
                             breadcrumbRenderer={breadcrumbRenderer}
                />
                <Navbar.Divider />
                <Search />
            </Navbar.Group>
            <Switch>
                <Route path="/projects/:project/:tabid">
                    <ProjectTabs project={this.props.global.project} />
                </Route>
            </Switch>
            <Navbar.Group align={Alignment.RIGHT}>
                <Button icon={IconNames.ADD}
                        text="Create project"
                        onClick={() => this.props.history.push('/projects/create')}
                        minimal/>
                <Popover2 content={menu} position={Position.BOTTOM_RIGHT}>
                    <Button icon={IconNames.USER}
                            minimal/>
                </Popover2>
            </Navbar.Group>
        </Navbar>
    }

    breadcrumbs(): BreadcrumbProps[] {
        const list:BreadcrumbProps[] = []
        list.push({href: "/projects", icon: "folder-close", text: "Projects"})
        if (this.props.global.project.code) {
            list.push({href: `/projects/${this.props.global.project.code}`, icon: "folder-close", text: this.props.global.project.name})
            if (this.props.global.volume.name)
                list.push({icon: "document", text: this.props.global.volume.name})
        }
        return list
    }

    logout = () => {
        api.users.logout()
            .then(() => window.location.reload())
    }

    invites = () => {
        this.props.history.push('/admin/invites')
    }
}
