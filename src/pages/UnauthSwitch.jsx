import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import ActivateInvite from "@/pages/ActivateInvite";
import Login from "@/pages/Login";

export default function UnauthSwitch() {
    return <Router>
        <Switch>
            <Route path="/invite/:code">
                <ActivateInvite/>
            </Route>
            <Route path="*">
                <Login/>
            </Route>
        </Switch>
    </Router>
}