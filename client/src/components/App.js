import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Login from "./pages/Login.js";
import Dance from "./pages/Dance.js";
import Admin from "./pages/Admin.js";
import FullRoster from "./pages/FullRoster.js";

import "../utilities.css";
import "./App.css";

import { get, post } from "../utilities";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      dancers: [],
    };
  }

  componentDidMount() {
    
  }


  render() {
    return (
      <div className="appContainer">
        <Router>
          <Login path="/" />
          <Dance path="/dance" />
          <FullRoster 
            path="/roster"
          /> 
          <Admin path="/admin" />
          <NotFound default />
        </Router>
      </div>
    );
  }
}

export default App;
