import React, {Component} from 'react'
import Login from "@/pages/Login";
import Logined from "@/pages/Logined";
import api from "@/api/Api";

export default class App extends Component<{}> {
    state = {
        logined: false
    }

    componentDidMount() {
        api.users.me()
            .then(() => this.setState({logined: true}))
    }

    render() {
        if (this.state.logined)
            return <Logined />
        else
            return <Login />
    }
}