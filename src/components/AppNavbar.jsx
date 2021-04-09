import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Alignment, Button, Navbar} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import type {RouteProps} from "@/types/RouteProps";
import api from "@/api/Api";

@withRouter
export default class AppNavbar extends Component<RouteProps> {
    render() {
        return <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>Translate</Navbar.Heading>
                <Navbar.Divider/>
                <Button text="Projects"
                        onClick={() => this.props.history.push('/projects')}
                        minimal/>

                <Button icon={IconNames.ADD}
                        text="Create project"
                        onClick={() => this.props.history.push('/projects/create')}
                        minimal/>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Button text="Logout"
                        onClick={this.logout}
                        minimal/>
            </Navbar.Group>
        </Navbar>
    }

    logout = () => {
        api.users.logout()
            .then(() => window.location.reload())
    }
}
