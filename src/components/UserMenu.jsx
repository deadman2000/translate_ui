import api from "@/api/Api";
import globalStore from "@/stores/GlobalStore";
import type {RouteProps} from "@/types/RouteProps";
import {Menu, MenuItem} from "@blueprintjs/core";
import React, {Component} from "react";
import {withRouter} from "react-router-dom";

@withRouter
export class UserMenu extends Component<RouteProps> {
    render() {
        return <Menu>
            {globalStore.isAdmin && (<>
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