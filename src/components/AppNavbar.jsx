import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {Alignment, Button, Menu, MenuItem, Navbar, Popover, Position} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import api from "@/api/Api";
import type {RouteProps} from "@/types/RouteProps";
import {GlobalStore} from "@/stores/GlobalStore";

@withRouter
@inject("global")
@observer
export default class AppNavbar extends Component<{global?: GlobalStore} & RouteProps> {
    render() {
        const menu = <Menu>
            <MenuItem text="Logout" onClick={this.logout}/>
        </Menu>

        return <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>{this.props.global.title}</Navbar.Heading>
                <Navbar.Divider/>
                <Button text="Projects"
                        onClick={() => this.props.history.push('/projects')}
                        minimal/>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Button icon={IconNames.ADD}
                        text="Create project"
                        onClick={() => this.props.history.push('/projects/create')}
                        minimal/>
                <Popover content={menu} position={Position.BOTTOM_RIGHT}>
                    <Button icon={IconNames.USER}
                            minimal/>
                </Popover>
            </Navbar.Group>
        </Navbar>
    }

    logout = () => {
        api.users.logout()
            .then(() => window.location.reload())
    }
}
