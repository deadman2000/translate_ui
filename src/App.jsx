import React, {Component} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import ProjectsSwitch from "@/components/project/ProjectsSwitch";

export default class App extends Component<{}> {
  render() {
    //return <Login />
    return <Router>
      <Switch>
        <Route path="/projects">
          <ProjectsSwitch />
        </Route>
        <Route path="*">
          <Redirect to="/projects" />
        </Route>
      </Switch>
    </Router>
  }
}