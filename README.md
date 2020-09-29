

## Fishing Log With Database and User Support 

https://jcybul-a3-persistence.glitch.me/

SAMPLE USER:
username: jcybul
password: 123

A new user can be created, but the provided user has some data already recorded, usefull when visualizing the sorting by weigth functionality

- This application was created to allow fishing anglers to keep a log of their catches, and some other details. Some of the challenged faced where regarding data manipulation. The creation of a login and user registration system with secure password took a large amount of time but where completed. The authentication method used was to provide a registration, where the username was unique, this was the method that worked after trying multiple differnt ways. Becasue of time contraints I used a simple CSS template, with a topnav, which provided structure to the navigation bar on my page. I only changed color, fonts(type and size) and organization elements(https://www.w3schools.com/css/tryit.asp?filename=trycss_template3). 
Middleware used:
-Bycript: allowed me to hash passwords and compare them.
-Ejs: a templating middleware for html formating
-Body-parsing: parses the request buffer data.

## Technical Achievements
- **Tech Achievement 1**: Used bcrypt for hashing passwords, storing the hashed password on the data base,providing a more secure webpage.
- **Tech Achievement 2**: Implemented a register page which allows new users to be registered, usernames are unique.
- **Tech Achievement 3**:Using login info insert username into the data without having the user do it, as well as date.
- **Tech Achievement 4**: Sorting data by a specific field, in my case fish weight 
### Design/Evaluation Achievements
- **Design Achievement 1**: CARP:
Contrast: Starting from the login page and the register , the elements that definitely will catch the users eye will be the background image with a boat, and then almost immediately I will say that the input boxes since they are chunks of white in a background that has mostly different tones of blue. Then the next page is when the user has logged in, here we have a lot happening, the background is the same but the boat is no longer visible so the input boxes in white once again will take all the attention, promoting the user to register their catch. then we have the buttons that allow you to submit that new entry, and since the table will immediately update the user attention all go to the new piece of information that is being displayed on the table. then the sort button has a slightly different color than the text all over the page which will interest the user to click on it an see what is doing.

Alignment: Starting from the login page and the register page, we have again the input boxes but in this case they are aligned with the text indicating what will go in each text box, then also the Login/Register button are vertically aligned and centered with the text boxes. As for the main page we first at bar on the top have the log out and register boxes aligned, and on the far left the welcome back user message as well, with the same font size, all the text on the page is horizontally aligned with everything on that line, the input boxes, the buttons and the data that is being displayed on the table. the size of the buttons and input boxes are the same which gives a continuous and smooth transition between them.

Repetition: For starters the background is the same image along all of the three pages, which makes transitions between them very smooth, and keeping the attention on the elements that change between pages, which are the important parts. Also all the titles have the same size, color and font. All the buttons across pages have the same color and hovering color, text size, font and text color. the register and login pages have linking links on the bottom left that could redirect you to the respective page. and Lastly all the input boxes across all of the pages have the same color, border and size, which makes the application very uniform, it is very nice how every single element stays consistent across, and this because of the constraints declared on the styling sheets. 

Proximity: Starting from the first page the user sees, the title informs the user that here is where he can login, and the at the bottom a register which is small but I think will do the job if you are not a user and are looking for a place to register. Then the same goes for registering. Then we have the main page. Here the title is the largest text and bolded black which will call the users attention, the we have on the tp right corner a well comeback message that since it has the username displayed I will think it will draw the users attention, then again a thing that will call the users attention are things that pop-up, so updated entries either when new data is inserted or the data is sorted will make the user look.
