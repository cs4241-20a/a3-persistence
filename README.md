# Application Name: To-Do List

## Glitch link: https://a3-haley-hauptfeld.glitch.me

### Project summary:

**Goal:** I made a to-do list application in which users can enter new tasks by entering them into the given field. These tasks are added to a database in MongoDB. Users can also modify those tasks by clicking on the task and directly editing it, and then clicking the corresponding 'modify' button. These modifications are updated in the mongoDB database. Users can also delete tasks by clicking the corresponding 'delete' button. This also deletes that task from the mongoDB database.

**Challenges:** A very large blocker I had was configuring mongoDB. The topology within the monogoDB database kept being destroyed and it took me several hours to debug this issue. The solution was to have a very specific uri reference that took hours to figure out. Due to this complication, another blocker that I ran out of time to fix was configuring the authentication. I was able to begin this process, but I did not have enough time to finish user authentication. I was able to create a login page, but there is no true authentication or unique user recognition when retrieving tasks from the database. I will explain how would I would go about doing this if I had more time in the next section.

**Authentication Strategy:** Again, I was unable to finish this part of the project. However, if I had more time to finish the project, I would use GitHub OAuth authentication using this tutorial as a reference: https://github.com/Sivanesh-S/github-oauth-express#readme. I would've chosen this strategy because GitHub OAuth authentication makes it easy to build and deploy a project that requires users to have a username and a password to access data from a database. Also, in addition to just this ability, GitHub OAuth includes limited access, meaning that tokens are created with the appropriate scope for the user whenever access is requested. This ensures users are receiving the appropriate amount of information (aka their unique tasks).
 
**CSS:** I chose Picnic(https://picnicss.com/) as my CSS framework because it's very lightweight. Also, Picnic is modular, meaning that each separate part of my webpage can be modified separately. I used custom CSS to have a color scheme.

**Express middleware packages:**

**body-parser:** This package parses the HTTP request body of each task that I send to and from the database.

**morgan:** This package logs my HTTP requests.

**response-time:** This package records the response time of my HTTP requests. I also had to use the package, 'node-statsd' from node to use response time properly.

**cors:** This package enables cross-origin resource sharing, which means outside users can request restricted information (such as unique user's tasks) from other domains.

**csurf:** This package protects my webpage from cross site request forgery. I also used the package 'cookie-parser' in order to properly install csurf.

### Design/UX Achievements:

**Design Achievement 1:** I used the following tips from the W3c Web Accessibility Initiative:

I provided informative, unique page titles for both my main page (To-Do List) and the login page (Login Page).

I used headings to convey meaning and structure by using a heading to signify the application is a to-do list. I also used a heading in my login page to signify that the page is a login page.

I provided clear instructions when a user enters a task by offering an example of what the user can input as a task within the input field. This example disappears when a user starts typing in the field to provide an easier UX.

I kept content clear and concise by using simple, short sentences. I avoided any complex words or phrases.

I provided ensured interactive elements are easy to identify by using a the CSS framework, Picnic, to style my interactive buttons, so when the user hovers over them, they slightly change color.

All of my form elements include clearly associated labels. On my login page, I clearly ask the user to provide a username and password. On the main page, I clearly ask the user to enter a new task.

I associate a label with all of my form controls.

I use the mark-up tag, main, to convey that that section is the main area of my web page. I want users to focus on entering new tasks.
 
I help users avoid and correct mistakes by sending an alert to pop-up on the page whenever the user deletes a task. This alert instructs the user that they cannot retrieve their deleted item and they must create a new task if they want it back in their list of tasks.

I reflect the reading order in my code order because when I remove the CSS styling, the order of the content makes sense.

I adapt to the user's technology by adjusting the margins of my main tag. For narrow viewports, the width is full, and for wider viewports, the width is put to the left.

I identify page language by using the lang attribute in the html tag for both my login page and my main webpage.
