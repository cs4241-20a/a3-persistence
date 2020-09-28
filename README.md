Readme
---

## My Movie List

https://movielist.zph.io

- A multi-user movie list and ranking manager with scores.
- Uses local authentication with the username/password(encrypted) stored in Mongodb.
- Uses Bulma as the CSS framework.
- Middlewares used: body-parser, cookie-parser, express-session, csurf, express-validator.

### Technical Achievements
- **Security**: Uses csurf to prevent CSRF (Cross-Site Request Forgery) attack, express-validator for filtering user inputs to prevent XSS attack, and mongo-sanitize to sanitize NoSQL injections. User permissions to data entries are verified—no unauthorized access or no user can modify others' data. Other security strategies such as setting the HttpOnly option for cookies, enabling TLS, and disabling X-Powered-By header are also implemented.
- **Modularity**: According to Node.js design concept, modular functions are separated into modules located in the routes directory, instead of all the stuff being in one file.
- **Deployment**: This project has been deployed at a Linode server with my own domain, and Nginx is used as the reverse proxy with the configuration file being provided. Uses PM2 as the process manager for Node. Hosting in a dedicated or virtual server gives the maximum privilege and flexibility for the application, whereas PaaS providers are more like a sandbox with the only advantage being easy to configure and deploy. 

### Design/Evaluation Achievements
- **Public User Page**: Each user has a dedicated public page to show off their own movie list.
