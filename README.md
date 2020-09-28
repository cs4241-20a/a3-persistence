# Assignment3  Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js 

Author: Mingxi Liu
Glitchme Link: https://a3-liumxiris.glitch.me/
Heroku Link: https://a3-liumxiris.herokuapp.com/

## How to serve on local device:
```
$npm install
$npm start
```
and go to <http://localhost:3000/>

## Not-To-Use Password Generator
The project is inspired by some password don'ts. Many people would like to include their personal information known by everyone else in their passwords. So I create the project that allows users to enter their personal information and generates the password. All the data is linked to users' github account and is permanently stored in the Mongodb. Users should be able to add, edit or delete the data. 

**CSS framework used: Bootstrap**

**Middleware packages used in this project:**
- Body-parser: allows express to read the body and then parse that into a Json object that we can understand
- Cookie-session: allows the authorization info( githubId ) to be stored in the browser
- Response-time: track the response time of the request
- Serve-favicon: allows serving the favicon from the given path
- Static: allows serving static files such as images or CSS files. 

## Technical Achievements
**Implement OAuth**
- Users are able to login with their github accounts.
*Note: Sometimes even if users have logged out, they can still log in without login prompt because the token has not yet expired. If the project needs to be tested with a different account, opening a new icognito window can solve the problem !

**Deploy on Heroku**
The reason why I chose Heroku is because I have experience deploying my other projects on it. Comparing to Glitch, Heroku is obviously more easy to use since every push to master will automatically deploy a new version of this app.


## Design/Evaluation Achievements
- **W3C Tips**:
 1. :white_check_mark: Provide sufficient contrast between foreground and background
 2. :white_check_mark: Associate a label with every form control
 3. :white_check_mark: Reflect the reading order in the code order
 4. :white_check_mark: Ensure that interactive elements are easy to identify
 5. :white_check_mark: Provide clear and consistent navigation options
 6. :white_check_mark: Ensure that form elements include clearly associated labels
 7. :white_check_mark: Use headings and spacing to group related content
 8. :white_check_mark: Provide informative, unique page titles
 9. :white_check_mark: Use headings to convey meaning and structure
 10. :white_check_mark: Provide clear instructions
 11. :white_check_mark: Keep content clear and concise
 12. :white_check_mark: Provide meaning for non-standard interactive elements