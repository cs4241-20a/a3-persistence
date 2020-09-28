# Assignment2  Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js 

Author: Mingxi Liu
Glitchme Link: https://a2-liumxiris.glitch.me/

```
$npm install mime
```
## How to serve:
```
$npm install
$npm start
```
and go to <http://localhost:3000/>

## Not-To-Use Password Generator
The project is inspired by some password don'ts. Many people would like to include their personal information known by everyone else in their passwords. So I create the project that allows users to enter their personal information and generates the password that they'd better not to use in the future : )

**Middleware packages used in this project:**
- Body-parser: allows express to read the body and then parse that into a Json object that we can understand
- Cookie-session: allows the authorization info( githubId ) to be stored in the browser
- Response-time: track the response time of the request
- Serve-favicon: allows serving the favicon from the given path
- Static: allows serving static files such as images or CSS files. 

## Technical Achievements
**Implement OAuth**
- Users are able to login with their github accounts.
*Note: Sometimes logout button does not really log out the user, it might because the cookie session is not completely destroied. Plez open a new icognito tab and it should ask you to log again. 

**Deploy on Heroku**


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