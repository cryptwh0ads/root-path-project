import React, { Component } from "react";
import { Link } from "react-router-dom/";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import { HomeButton, LoginButton } from "./styles";
class Navbar extends Component {
  render() {
    return (
      <AppBar position="fixed">
        <Toolbar style={{ margin: "0px 0px 0px 120ch" }}>
          <HomeButton variant="outlined" component={Link} to={"/"}>
            Home
          </HomeButton>
          <LoginButton component={Link} to={"/login"}>
            Login
          </LoginButton>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Navbar;
