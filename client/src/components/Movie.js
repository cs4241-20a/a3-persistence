import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

class Movie extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        console.log(data.get("movieName"));
        console.log(data.get("seen"));

        fetch("/api/movie", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                movieName: data.get("movieName"),
                seen: data.get("seen"),
            }),
        });
    }

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Form inline onSubmit={this.handleSubmit}>
                    {" "}
                    <Label for="exampleEmail" className="mr-sm-2">
                        Movie
                    </Label>
                    <Input
                        id="movieName"
                        name="movieName"
                        placeholder="Lord of the Rings"
                        type="text"
                    />{" "}
                    <Label check>
                        <Input id="seen" name="seen" type="checkbox" /> Seen?
                    </Label>
                    <Button>Submit</Button>
                </Form>
            </div>
        );
    }
}

export default Movie;
