import React from "react";
import "./App.css";
import AppNavbar from "./components/AppNavbar";

import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="App">
                <Route path="/" exact component={Home} />
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
