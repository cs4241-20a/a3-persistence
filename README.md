## Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

Website: https://a3-aditya-malik.herokuapp.com/

TaskBuddy is a To-do list that allows users to organize their schedules by adding tasks they need to complete, along with a priority of when to complete it by. The app then provides users with an estimate of the amount of the time they have left to work on the task, based on the priority. 

- The biggest challenges for me were correctly implementing the GitHub OAuth, and using a custom CSS template such as Bootstrap. Implementing the GitHub OAuth turned out to be much more complicated than I anticipated and due to faulty callbacks I was getting internal errors and authentication faults. Implementing Bootstrap was also quite challenging intially, given the amount of options available and the different spacing methods.
- I decided to use both the local strategy and Git authentication strategy. The local strategy was quick and easy to implement, but I added the GitHub strategy to achieve the technical points and becuase it is useful to know for future projects.
- For CSS framework I decided to use Bootstrap because its lightweight, fairly customizable, and widely used. There is also a good amount of documentation available which makes learning easier.
- 5 express middlewear packages used: 
  - session: Used to store user session in Database 
  - PassportJS: Used for authentication using strategies such as OAuth
  - morgan: Used to log requests in console
  - compression: Compresses HTTP responses
  - bcrypt: Used to hash and verify passwords
  - express.json(): alternative for body-parser

### Technical Achievements
- **Implemented OAuth authentication with passport.js**: I used OAuth authentication via the GitHub strategy and the Local strategy. Used the passport.js library.
- **Hosted Site on Heroku**: Hosted site on Heroku instead of Glitch. The biggest benefit with using Heroku is the ability to enable automatic deploys from GitHub, which means that any changes in the GitHub repo are automatically reflected in Heroku. Furthermore, Heroku has a more professional and coherent user-interface. 

### Design/Evaluation Achievements
- **Site uses CRAP Principles of Design**: While the site includes contrasting elements to bring them to attention and make it easier for the user to follow through the application, I did not have enough time to implements the other aspects of the CRAP method. 

### Base Requirements
- Server created using Express
- Results functionality which shows entire dataset in server's memory
- Form/Entry functionality which allows users to add/modify/delete data items
- Persistent data storage in between servers using MongoDB
- Bootstrap as a CSS Framework/Template
- HTML input tags(textarea, input)
- HTML displays all data for a specific authenticated user
- Small amount of front-end JavaScript to get/fetch data from server