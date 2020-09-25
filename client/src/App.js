import React, { Component } from "react";
import AppNavbar from "./components/AppNavbar";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Route path="/" exact component={Home} />
                    <Route path="/WerewolfHome" component={WerewolfHome} />
                    <Route path="/Room" component={Room} />
                </div>
            </Router>
        );
    }
}

function Home() {
    return (
        <div>
            <AppNavbar />
        </div>
    );
}

export default App;
