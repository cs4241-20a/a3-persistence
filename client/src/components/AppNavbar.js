import React, { Component } from "react";
import { Navbar, NavbarBrand, NavLink, NavItem, Container } from "reactstrap";

class AppNavbar extends Component {
    render() {
        return (
            <div>
                <Navbar color="dark" dark expand="sm" className="mb-5">
                    <Container>
                        <NavbarBrand href="/">Movies</NavbarBrand>
                        <NavLink href="/auth/github">Login with Github</NavLink>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

export default AppNavbar;
