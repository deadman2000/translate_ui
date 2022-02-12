import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Menu, MenuItem} from "@blueprintjs/core";
import api from "@/api/Api";
import type {RouteProps} from "@/types/RouteProps";
import user from "@/stores/UserInfo";

@withRouter
export class UserMenu extends Component<RouteProps> {
    render() {
        return <Menu>
            {user.isAdmin && (<>
                <MenuItem text="Invites" onClick={this.invites}/>
            </>)}
            <MenuItem text="Logout" onClick={this.logout}/>
        </Menu>
    }

    logout = () => {
        api.users.logout()
            .then(() => location.reload())
    }

    invites = () => {
        this.props.history.push('/admin/invites')
    }
}