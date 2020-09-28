## Student List

your glitch link：https://a3-yaru-gong.glitch.me/

- Goal: To build a web page that authorized user can add, modify, remove data.
- Challenges: Learn and use middleware.
- Authentication strategy: passport.js combined with mongodb, because the encoded password and user name will be stored safely in the database.
- CSS framework: Materialize, because the design is modern and concise, and the color palette looks right good.
  - Modifications: I just hide the edit div when not needed, and replace the add div with edit div when needed.
- Middleware: 1.Passport for authentication. 2.Session for tracking authorized user. 3.body-parser for parsing the body on the server. 4.bcrypt for encrypting password. 5.flash for show error messages.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication, the default acount is:[name:User, password:123], or you can create your own on the register page.
- **Tech Achievement 2**: 

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative: 1.informative, unique title.2.Use headings to convey meaning and structure.3.Have explanation for link.4.Write text next to icons.5.Use 'for' with 'id'. 6.Add html lang="en".7.Button like add, submit have bright color.8.Other than color, use icon and text to explain.9.Have mouse hover style. 10.Have consistent navigation in login, register page.11.Have clear description next to input.12.Alert when input is illegal.
- **Design Achievement 2**: 
1. Proximity: in the main page, the description of table "Student List" is close to the table on the right side. The input box on the left side is close to the label “Add a new student”. It will make more sense that related information or content are closer to each other. On the login page or register page, all input boxes are close to each other. Other than input box, there is no extra thing in the page as well. As a result, people can see them one after one and know they finish read all information. In the table of student list, the inline distant is not that large too, so it will be easy for people read, and they will not get distracted. 
2. Alignment: The login and register are all align to left, which looks more sharp and concise comparing with align to center according to the Non-Designer’s Design Book, because it shows the power of line. In the main page, log out button is aligned to right on the top, because generally the exit button is always on the upper-right corner intuitively. Headings of table, adding student, and editing student information are all aligned to left, just like the login and register page that the headings of “Login” and ”Register” are aligned to left. For all three pages, inside all input boxes, the labels like name, major, school year are all aligned to left as well to have a consistent style for all contents in all pages. 
3. Contrast: The background color for all three pages are grey, because I do not want the background color gets too much attention from the users, because it might distract them from the information. However, for the log out, login, register button, I chose to use red, which make a strong contrast with the grey color, because just like login, log out, or register, those information are important, I hope the user could find them at first time. As a result, I used grey and red color made a contrast, which potentially influence what the users see in my pages. In the table, I use green color, which is a bright color, but also a contrast color to red. The color of green get people’s attention but at the same time are discriminable from those red buttons.
4. Repetition: As what I mentioned before, the background color for all page are the same. The important buttons color are the same as well. I also made the table title has the same color as submit button when modifying data. The input boxes for adding student and editing student use exact same style, and the style of both titles are the same as well. That is because when the users do not need to edit data, the editing div will not be displayed. When editing, it will replace the adding div. If the style is too different, the design will be not consistent anymore. Also, after clicking the edit button, the color will change to the same as the color of table title. It is also a kind of repetition.
