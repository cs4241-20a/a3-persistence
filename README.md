## favorate game

Zaiyang Zhong github id = anyuwanqing
https://glitch.com/edit/#!/join/d6edf170-7ae5-4eed-b305-fe2f10e56228
https://glitch.com/~iridescent-band-plate

Log In to fill out a survey on your favorite game. Data can be modified or deleted, and the statistic will be shown.

The goal of the application is to add, edit, and delete data in Mongodb.

My challenge is mainly on that i kept getting the "npm does not support Node.js" errors, and spent endless hours to debug this. (It's the npm and Node js compability issue) Also, I spent too long to figure out how to seperate login and table into two html files (and finally found that i only had to hide the content in the same html file).

# errors with npm

In case you have the same problem, go to terminale and do: enable-npm, then npm install (all dependencies)
Also, enter non-float value for game cost will result in error in Results.

# authentication

I created 2 databases, one for storing correct account data, and other for storing the players' info.
By default, you can enter

      admin
      password

to log in. Some sample data are already added to the Mongodb. I used passport for authentication because it seemed to be easier.

# express midleware

1. body-parser: allow me to handle request obj and transorm to JSON
2. Passport: handle authentication for user login
3. error-handler: for processing error messasge in a more tidy way
4. helmet: helps to secure Express apps by setting various HTTP headers
5. response-time: records the response time for requests in HTTP servers

# baseline

mongodb is used as database. I used the free version and created 2 databases, one for accounts and one for players' data.
Express is used.
Result is shown as statistic table at the bottom.
Form/entry is a table that display data for different catagory.
Password DBPASSWORD for mongodb is added in .env file to remain hidden.

# html

use th, tr, label, input for table display

# CSS

Project: https://github.com/oxalorg/sakura/
I used sakura and Wing; sakura gives it a soft feeling to the text
what CSS framework you used and why

include any modifications to the CSS framework you made via custom CSS you authored

Tech Achievement 1: Intead of Github, I used passport-local for the OAuth authentication. I was having trying implementing the github log-in and finally gave up. The authenticate() passport provides is used as middleware to authenticate request.

Design/Evaluation Achievements
Design Achievement 1: I followed the following tips from the W3C Web Accessibility Initiative...
Contrast: The content and the form are the most important elements on this site, so I make the background very light and the words will stand out.
This will be the biggest contrast on my page. For other contrast, you may notice the button used for form submit has a dark background, but the text is white; this becomes the second largest contrast of my page. This design of button will help users to find them very easily. Also, not only the button stands out on its own, its background has a contrast with the page background, which makes it even better for users to recognize the buttons.
Other contrast includes the font size: the most important title will be the largest, followed by the sub titles and the statistic table. The text box for data input will be smaller, because they are less significant than the title.
  
Proximity: First I need to make sure that in order to have a consistant format, I will have all the content's layout in the center of the page: all titles, buttons, input box, table, and statistic data will be in the center.
Second I make sure the spacing for the overal site is consistant. For example, Login with the form and Add user with the form below has the same spacing. For both table and statistic, because they are equally important I add a line below the title to seperate them equally, so users can identify that Table and Statistic are two different parts from the first glance.
it's also very important that I have spacing between 2 input box so they do not look like they are merging. Keeping a space between the boxes also give a sense of comfort to users, because when things are more spaced out it feels more open, less stressed.
  
Repeat elements: In fact, all fonts will be the same; and the only difference to them is the font-size. I used the same font to keep a consistancy throughout my site. Also, the same format for title are used (Login and Add User) so it helps users to know that they are similar forms.
Form elements will be consistent on their style: a placeholder is added when users enter inputs; the color is also consistent when their mouse hover on a certain box.
When the mouse hovers on Submit button, it becomes pink, which gives a big contrast with black and help users to know which buttons they are trying to press on. The style for Table is consistent, with equal spacing, and similar format for buttons.
  
Align: First I need to make sure all elements on this page will be centered, so nothing looks like they are falling out or inconsistent. Then, I made sure that the table spreads out with the same width, so these input boxes will look like they belong to the same table. If the size is inconsistent for one element, I believe it will look really awkward. Finally, all buttons for submit is aligned and two forms appear to be in the same position (center) on the page.
Table and Statistic are also aligned so they look like they belong to the same stylesheet and has similar format even though they display different kind of data. The data in the table is also perfectly aligned and look neat and tidy.
