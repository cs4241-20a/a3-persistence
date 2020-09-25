import React, { Component } from "react";
import { Button, Form, Table, Label, Input } from "reactstrap";

class Movie extends Component {
    constructor(props) {
        super(props);

        this.state = {
            movies: [],
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getMovies();
    }

    getMovies = () => {
        fetch("/api/movie", {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // let stubData = [
                //     {
                //         _id: "5f6e4cef2f0b6b4b94ced583",
                //         movieName: "test",
                //         seen: "on",
                //         userID: "69",
                //         __v: 0,
                //     },
                //     {
                //         _id: "5f6e509de85c354cacc84ca7",
                //         movieName: "abc",
                //         seen: null,
                //         userID: "69",
                //         __v: 0,
                //     },
                // ];
                this.setState({ movies: data });
            });
    };

    /*
        TODO
        Check cookie on post request
        when component loads send get request to api   
    */

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        if (data.get("movieName")) {
            // console.log(data.get("movieName"));
            // console.log(data.get("seen"));

            fetch("/api/movie/add", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    movieName: data.get("movieName"),
                    seen: data.get("seen"),
                }),
            }).then(this.getMovies());
        }
    }

    render() {
        let tableBody = null;
        if (this.state.movies.length > 0) {
            tableBody = this.state.movies.map((movie, index) => (
                <tr key={index}>
                    <th scope="row">{movie.movieName}</th>
                    <th>{movie.seen ? "yes" : "no"}</th>
                </tr>
            ));
        }

        return (
            <div>
                <Form
                    inline
                    onSubmit={this.handleSubmit}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
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
                <br />
                <Table>
                    <thead>
                        <tr>
                            <th>Movie</th>
                            <th>Seen?</th>
                        </tr>
                    </thead>
                    <tbody>{tableBody}</tbody>
                </Table>
            </div>
        );
    }
}

export default Movie;
