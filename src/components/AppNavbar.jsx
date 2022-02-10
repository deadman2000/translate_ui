import Search from "@/components/project/Search";
import {ProjectTabs} from "@/components/ProjectTabs";
import {UserMenu} from "@/components/UserMenu";
import {GlobalStore} from "@/stores/GlobalStore";
import user from "@/stores/UserInfo";
import type {RouteProps} from "@/types/RouteProps";
import {Alignment, Breadcrumb, BreadcrumbProps, Breadcrumbs, Button, Icon, Navbar, Position} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {Popover2} from "@blueprintjs/popover2";
import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import {Link, Route, Switch, withRouter} from "react-router-dom";


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
@inject("global")
@observer
export default class AppNavbar extends Component<{global?: GlobalStore} & RouteProps<R>> {
    render() {
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
                {user.isAdmin && (
                    <Button icon={IconNames.ADD}
                            text="Create project"
                            onClick={() => this.props.history.push('/projects/create')}
                            minimal/>
                )}
                <Popover2 content={<UserMenu/>} position={Position.BOTTOM_RIGHT}>
                    <Button icon={IconNames.USER}
                            text={user.login}
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
}
