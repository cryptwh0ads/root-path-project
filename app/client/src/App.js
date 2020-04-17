// Modules
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
// Components
import Navbar from "./components/Navbar";
// Styles
import "./App.css";
// Pages
import Home from "./pages/home";
import Login from "./pages/login";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#FFF",
      main: "#F5F5F5",
      dark: "#E8E8E8",
      contrastText: "#FFF",
    },
    secondary: {
      light: "#FFF",
      main: "#F5F5F5",
      dark: "#E8E8E8",
      contrastText: "#FFF",
    },
  },
  typography: {
    useNextVariants: true,
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
