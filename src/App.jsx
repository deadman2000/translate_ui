import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import CreateProject from "@/components/project/CreateProject";
import ProjectsList from "@/components/project/ProjectsList";

export default class App extends Component<{}> {
  render() {
    //return <Login />
    return <Router>
      <Switch>
        <Route path="/projects">
          <Switch>
            <Route path="/create">
              <CreateProject />
            </Route>
            <Route>
              <ProjectsList />
            </Route>
          </Switch>
        </Route>
      </Switch>
    </Router>
  }
}