import React, { Component } from "react";
import AppNavbar from "./components/AppNavbar";
import Movie from "./components/Movie";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Route path="/" exact component={Home} />
                </div>
            </Router>
        );
    }
}

function Home() {
    return (
        <div>
            <AppNavbar />
            <Movie />
        </div>
    );
}

export default App;
