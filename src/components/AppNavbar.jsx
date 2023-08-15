import {BreadcrumbProps} from "@blueprintjs/core"
import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {Alignment, Breadcrumb, Button, Icon, Navbar, Position} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {Breadcrumbs2, Popover2} from "@blueprintjs/popover2";
import Search from "@/components/project/Search";
import {UserMenu} from "@/components/UserMenu";
import {GlobalStore} from "@/stores/GlobalStore";
import user from "@/stores/UserInfo";
import type {RouteProps} from "@/types/RouteProps";
import {HintSwitch} from "@/components/HintSwitch";
import {NonprintSwitch} from "@/components/NonprintSwitch";


function breadcrumbRenderer({ text, href, icon }: BreadcrumbProps) {
    if (href)
        return <Link className="bp4-breadcrumb" to={href}><Icon icon={icon}/> {text}</Link>
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
                <Breadcrumbs2 items={this.breadcrumbs()}
                              currentBreadcrumbRenderer={breadcrumbRenderer}
                />
                <Navbar.Divider />
                <Search />
            </Navbar.Group>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Divider />
                <HintSwitch />
                <NonprintSwitch />
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                {user.isAdmin && (
                    <Button icon={IconNames.ADD}
                            onClick={() => this.props.history.push('/projects/create')}
                            minimal/>
                )}
                <Popover2 content={<UserMenu/>} position={Position.BOTTOM_RIGHT}>
                    <Button icon={IconNames.USER}
                            text={user.login}
                            minimal/>
                </Popover2>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                {this.props.global.project.code && <span>Translated: {this.props.global.projectLetters}</span>}
                <Navbar.Divider />
                <Button icon={IconNames.COMMENT} className="btn-badge"
                        onClick={() => this.props.history.push('/notify')}
                        text={this.props.global.unread ? this.props.global.unread : ""}
                        minimal/>
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
