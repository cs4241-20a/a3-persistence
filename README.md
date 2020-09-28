Assignment 3 - Milktea Order and Pickup Project
===
Baseline Requirements
---
- Author: Jialin Song
- Glitch link: https://a3-jialin-song.glitch.me/

This project includes a two login methods, first is to user OAuth github authorization, second is to register for an account and login from that. There will be a username restriction for register account, no repetitive username can be registered. After login, user is able to add, modify or delete any of his/her own data. User will not be able to see other people's orders. For milktea selection, user can choose not to have topping/add-in, but other fields (tea base, milk and pickup time) are all required. If you would like to check the `Results` functionality for viewing (cannot edit) all data from all users, you can use the below account:
- Username: admin
- Password: cs4342

Acheivements
---
### Technical Achievements
- **Tech Achievement 1**: (10 points) OAuth authorization of github login was implemented with passport middleware. 

### Design/Evaluation Achievements
- **Design Achievement 1**: (10 points) 12 tips were implemented from [W3C](https://www.w3.org/WAI/)'s writing, designing and development part.
  1.	Provide informative, unique page titles
  2.	Use headings to convey meaning and structure
  3.	Provide clear instructions
  4.	Provide sufficient contrast between foreground and background
  5.	Ensure that interactive elements are easy to identify
  6.	Provide clear and consistent navigation options
  7.	Ensure that form elements include clearly associated labels
  8.	Provide easily identifiable feedback
  9.	Use headings and spacing to group related content
  10.	Associate a label with every form control
  11.	Identify page language and language changes
  12.	Reflect the reading order in the code order

Summary
---
- the goal of the application: let users to login and order milktea with a form; orders of this user will be shown as a table.
- challenges you faced in realizing the application: Implementing OAuth took me a unexpectedly long time. It's pretty tricky to work with in my opinion.
- what authentication strategy you chose to use and why: `GitHubStrategy` is used, considering that all of the students, TA and professor have github account.
- what CSS framework you used and why:  [`MUI css`](https://www.muicss.com/) is used because of its convenience to implement and develop.
- Persistent data storage was implemented with `MongoDb`.
  - There is no overwriting, but some background colors are modified to satisfy some of the tips from `W3C`.
- Middleware packages used with `Express` server:
  - bodyparser: to convieniently handle json
  - passport: for basic authorization
  - passport-github: provide authorization strategy of github 
  - cookie-session: to handle the user data when transferring from my web page to authorization website and transfer back
  - connect-timeout: if the webpage use more than 5 seconds to load, it will be seen as "timeout"
  - dotenv: enable the use of '.env' file to store important data, such as client id, secret and cookie key.
