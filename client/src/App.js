import React from "react";
import "./App.css";
import AppNavbar from "./components/AppNavbar";
import Login from "./components/Login";
import Profile from "./components/Profile";

import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="App">
                <Route path="/" exact component={Home} />
                <Route path="/Login" component={Login} />
                <Route path="/Profile" component={Profile} />
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div>
            <AppNavbar />
        </div>
    );
}

export default App;
