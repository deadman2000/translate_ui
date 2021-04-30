import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {Alignment, Breadcrumbs, Button, Icon, Menu, MenuItem, Navbar, Position} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {Popover2} from "@blueprintjs/popover2";

import api from "@/api/Api";
import type {RouteProps} from "@/types/RouteProps";
import {GlobalStore} from "@/stores/GlobalStore";
import Search from "@/components/project/Search";
import {IBreadcrumbProps} from "@blueprintjs/core";


function breadcrumbRenderer({ text, href, icon }: IBreadcrumbProps) {
    return <Link className="bp3-breadcrumb" to={href}><Icon icon={icon}/> {text}</Link>
}

@withRouter
@inject("global")
@observer
export default class AppNavbar extends Component<{global?: GlobalStore} & RouteProps> {
    render() {
        const menu = <Menu>
            <MenuItem text="Logout" onClick={this.logout}/>
        </Menu>

        return <Navbar fixedToTop>
            <Navbar.Group align={Alignment.LEFT}>
                <Breadcrumbs items={this.breadcrumbs()}
                             breadcrumbRenderer={breadcrumbRenderer}
                />
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Search />
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

    breadcrumbs(): IBreadcrumbProps[] {
        const list:IBreadcrumbProps[] = []
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
}
