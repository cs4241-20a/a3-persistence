## A3: To-Do List

https://todo.zhdev.app

A personal to-do list manager application.

- Objective: Manage a personal, unique to-do list per-user with the ability to add, edit, and complete (delete) items.
- I experienced challenges working with the database (specifically which functions to use).
- I chose to do OAuth2/OpenID Connect with GitHub as my IdP. I chose this because I am familiar with OIDC and it seemed easier than handling user credentials.
- I used mongoose as my mongodb driver, mainly because I wanted an extra challenge.
- I used Bootstrap (specifically BootstrapVue) for CSS/Layout/Styling. Due to how it works as Vue components, some of the form components get mangled by the framework. I did use tags like `<input>`, just via `<b-form-input>`.
- User accounts are automatically created on login.
- Middlewares:
  - Passport: Provides authentication with GitHub
  - Body-Parser: Makes it easier to access the body as text when uploading new items to server.
  - Helmet: Adds some nice HTTP headers to improve security (like HSTS, CSP).
  - Morgan: Logs all requests to the console for debugging.
  - Connect-Rid: Assigns each request a unique ID to aid in debugging.

## Technical Achievements
- **OAuth2/OIDC Authentication**: I used Passport with GitHub to accomplish this. Users are automatically registered and tracked based on their GitHub account 'ID' from the OAuth flow.
- **Alternative Hosting Service**: I decided to containerize the application into docker, and then run the container on a Kubernetes cluster. One of the things that is better about this is it can scale better than glitch, offers more customization, and can host the MongoDB instance on the same platform. For the actual cluster, I have it hosted with Civo mainly because I have some credits there. The only downside here is complexity and time to setup.

### Design/Evaluation Achievements
None