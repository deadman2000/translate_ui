import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {Alignment, Button, InputGroup, Menu, MenuItem, Navbar, Position} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {Popover2} from "@blueprintjs/popover2";

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

        return <Navbar fixedToTop>
            <Navbar.Group align={Alignment.LEFT}>
                <Button text="Projects"
                        onClick={() => this.props.history.push('/projects')}
                        minimal/>
                <Navbar.Divider/>

                {this.props.global.project && <Navbar.Heading>
                    <Button text={this.props.global.project.name}
                            onClick={() => this.props.history.push(`/projects/${this.props.global.project.code}`)}
                            minimal/>
                </Navbar.Heading>}

                {this.props.global.volume && <Navbar.Heading>{this.props.global.volume.name}</Navbar.Heading>}
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <InputGroup
                    placeholder="Search"
                    leftIcon={IconNames.SEARCH}
                />
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

    logout = () => {
        api.users.logout()
            .then(() => window.location.reload())
    }
}
