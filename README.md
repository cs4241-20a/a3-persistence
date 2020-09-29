## Online Recipe Book
###### Carly Pereira

[https://a3-carlypereira.glitch.me](https://a3-carlypereira.glitch.me)

This project allows the user to log in with Github and store recipes.
The user is able to add recipes on one side, and view, edit, and delete recipes on the other.
I decided to use Github OAuth for authentication since after trying to roll my own I was unable to
properly handle the current user logged in.
Passport allowed me to offload the work of authentication making it easier to focus on the
functionality of the site.
For styling I went with Bootstrap. For stylign I went with bootstrap. I am familiar with it, so
I knew how best to use it for this application.

the five Express middleware packages I used are
- _serve-favicon_ is used to serve the little icon that appears in the tab in the web browser.
- _passport_ is used to manage the authentication to github
- _cookie-session_ is used to manage the cookies that handle the current user
- _body-parser_ makes it easy to parse json in the body of requests. 
- _helmet_ helps make my http requests secure. While I'm not 100% certain if this strategy is completely
secure, it is a step in the right direction.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
