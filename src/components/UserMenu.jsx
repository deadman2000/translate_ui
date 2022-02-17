import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {inject} from "mobx-react";
import { Menu, MenuItem} from "@blueprintjs/core";
import api from "@/api/Api";
import type {RouteProps} from "@/types/RouteProps";
import user from "@/stores/UserInfo";
import {GlobalStore} from "@/stores/GlobalStore";

@withRouter
@inject("global")
export class UserMenu extends Component<{global?: GlobalStore} & RouteProps> {
    render() {
        return <>
            <Menu>
                {user.isAdmin && (<>
                    <MenuItem text="Users" onClick={this.users}/>
                    <MenuItem text="Invites" onClick={this.invites}/>
                    <MenuItem text="Videos" onClick={this.videos}/>
                </>)}
                <MenuItem text="Change password" onClick={this.changePassword} />
                <MenuItem text="Logout" onClick={this.logout}/>
            </Menu>
        </>
    }

    logout = () => {
        api.users.logout()
            .then(() => location.reload())
    }

    invites = () => {
        this.props.history.push('/admin/invites')
    }

    users = () => {
        this.props.history.push('/admin/users')
    }

    videos = () => {
        this.props.history.push('/admin/videos')
    }


    changePassword = () => {
        this.props.global.setChangePassword(true)
    }
}