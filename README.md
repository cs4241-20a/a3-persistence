## Movie Watch List

Jacob Tutlis https://a3-jtutlis.herokuapp.com/

For this project I implemented an application that allows users to keep a list of movies that they want to watch and movies that they have seen. I decided to implement this project using React so I could gain more experience with the framework.

To use this application the user must first click on the 'Login with Github' text. This will allow the user to login with Github which allows us to identify the user. Once the user is logged in they can refresh the application to get all of their movies and they can also start adding new movies.

Right now the user can only add new movies and change if they have seen a movie re-entering the movies and changing if it has been seen.

-   The goal of this project was to create an application that would keep track of all the movies a user wants to watch and keep a log of all the movies the user has seen.
-   The biggest challenge I faced this project was learning how to use React.
    -   I also had some issues trying to connect the React dev server with my node server.
-   I used the OAuth Github strategy.
-   I used Bootstrap for my CSS.

### Middleware Packages

1. passport: Authenticates requests to identify users
2. cookie-session: Manages user sessions with cookies
3. config: Reads config files that contains api keys and other secrets
4. morgan: HTTP request logger
5. path: Used on Heroku deployment to serve files
6. mongoose: MongoDB object modeling tool

## Technical Achievements

-   **Github OAuth**: I used OAuth authentication via the GitHub strategy. The user is sent a cookie and whenever the user logs onto the page or adds a new movie, their cookie is used to get their unique ID. This allows the application to serve each user with their personal data.
-   **Deployed on Heroku**: Instead of Glitch I used Heroku. Heroku was better because it can connect directly to Github repositories and deploy the latest version of the application whenever new code is pushed.
