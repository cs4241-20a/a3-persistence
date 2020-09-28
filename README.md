Pooja Patel https://a3-pooja-patel.glitch.me/

This project is Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

## La Fleur by Pooja Patel

I created a flower shop webpage that woud allow a user to shop for single flowers or a dozen. The webpage also allows the user to see their order history and also edit or delete their order.
The CSS positionng techniques that I used were using element selectors, ID selectors, and class selectors.
The goal is for users to place orders for flowers by a single flower or by the dozen. The challenges I faced were implementing the Express server, since I have not worked with it before.
The authentication strategy I used was through passport.js. For the database I used a lowdb. I used this because the database would be stroing a large amount of information, also because it was intuitive to implement, also that there is persistent data storage.
For the CSS framework I chose to use Bootstrap in combination with elements I previously used on the last project.
The five Express middleware packages I used are the following:

- Passport, to authenticate using stategies
- Body-parser, to parse HTTP request body
- Cookie-parser, to parse cookie header and populate req.cookies
- Express.static, serves static files such as images, CSS, and JS
- Helmet, to secure apps by setting various HTTP headers

## Login Credentials

- Username: username
- Password: password

## Technical Achievements

- **Login**: Implemented OAuth authentication, with a library, passport.js.
- **Login/Logout**: The landing page is now a Login page or register an account page. While on the site after logging in, you may also logout.
- **Order Form**: I included a form on the landing page for the user to order flowers.
- **Form Completion Checking**: The form will be checked if has been completely filled out. If the form has not, a pop-up will appear. Otherwise a submission page will appear.
- **Menu on Webpage**: For easier navigation the webpage includes a menu to switch between ordering flowers and looking at the order history.
- **User History Updates**: The webpage will update the order history table when the user selects the history page, the user will be able to update or delete the order.
- **Price Calculation**: A function was included to calculate the cost for the ordered flowers.

### Design/Evaluation Achievements

- **Transition on Login Page**: The login page is animated to slide down when the page is first lloaded/ refreshed.
- **Transition background for Color Scheme**: Using JavaScript and CSS I was able to use a color scheme to modulate between a few colors to animate the background.
- **Images that Match Theme**: I included images on my webpage to add to my projects theme and color scheme.
- **Various Form Options**: The form I created included text-box repsonses, radio buttons, and a submit button.

### Links for the images I used:

- https://www.weloveflorists.com/2019/06/21/how-to-start-a-wedding-florist-business-all-you-need-to-know/
- https://www.floristmargate.com/product/5762f13c2ff66/classic-long-stem-yellow-rose-bouquet
- https://www.housebeautiful.com/entertaining/holidays-celebrations/g4365/mothers-day-flowers-ideas/
- https://www.chicagolandflorist.com/always-on-my-mind-flower-bouquet/
- https://www.ftd.com/product/abundant-rose-bouquet-prd-e5-5239s
