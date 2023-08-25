import SaidScriptsPage from "@/pages/projects/parser/SaidScriptsPage"
import SaidsPage from "@/pages/projects/parser/SaidsPage"
import React, {Component} from "react"
import {Route, Switch} from "react-router-dom"

export default class SaidsSwitchPage extends Component {
    render() {
        return <Switch>
            <Route path='/projects/:project/saids/:script' exact>
                <SaidsPage/>
            </Route>
            <Route path='/projects/:project/saids' exact>
                <SaidScriptsPage/>
            </Route>
        </Switch>
    }
}