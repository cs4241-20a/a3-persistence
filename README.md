## Car Wishlist
By: William Yang

Glitch: https://a3-william-yang.glitch.me/
Heroku: https://a3-william-yang.herokuapp.com/

The goal of this application was to provide users a website to compile their car wishlist. I faced two main challenges when developing the site. Both challenges were related to my having a hard time understanding how my server would connect to and draw information from mongodb and the GitHub OAuth. I decided to use the GitHub authentication strategy because that was what would give me the technical achievement.

I used the Material UI framework because I think it is a good design language and the template looked well designed. I did not make any modifications to the framework, although I needed to include my own css file to format the pages themselves.

Express Middleware Packages:
1. cookie-session: Enables storage of cookies in the browser (in this case, login status).
2. static: Allows the server to access files all files in the /public folder and its subdirectories.
3. compression: Compresses the server responses to a smaller size.
4. response-time: Allows the server to log the server response time of a request.
5. body-parser.json: Makes it easier for the server to handle json GET/POST requests.

## Technical Achievements
- **(10 Points Max) Implement OAuth authentication**: I used OAuth authentication via the GitHub strategy. I took inspiration from https://github.com/kevinsimper/node-github-auth-example/ and https://github.com/Sivanesh-S/github-oauth-express#readme in order to achieve this.
- **(5 Points Max) Deploy on Heroku**: Deployed on Heroku instead of Twitch. I liked it better than Glitch because it allowed me to directly integrate with my GitHub branch instead of having to constantly manually import from it in order to update my Glitch app. Thus, it saves me a bit of time every time I want to make changes.

### Design/Evaluation Achievements
- **(10 Points Max) Follow 12 Tips from W3C**: I followed the following tips from the W3C writing, designing, and development tips.
  - Writing Tips:
    1. Provide informative, unique page titles
      * Page tabs inform the user what page they are on
    2. Use headings to convey meaning and structure
      * All important sections have headings to explain what they are
    3. Provide clear instructions
      * Instructions are clear where necessary
    4. Keep content clear and concise
      * No paragraphs present, all text is in short phrases
  - Design Tips:
    5. Provide sufficient contrast between foreground and background
      * Background and foreground set to colors/images/videos that properly contrast with one another
    6. Ensure that interactive elements are easy to identify
      * All interactive elements either change color or are highlighted (look carefully) when selected via mouse or keyboard
    7. Provide clear and consistent navigation options
      * Navigation in and between pages very clear and consistent
    8. Ensure that form elements include clearly associated labels
      * All forms are clearly labelled
    9. Use headings and spacing to group related content
      * Contents largely formatted in groups via a css grid format
  - Development Tips:
    10. Use mark-up to convey meaning and structure
      * Markup present in html code to 
    11. Help users avoid and correct mistakes
      * Example values are provided for all forms of text input
      * When non-number values are present in year input, form highlights red on submission and submissoin is denied
    12. Reflect the reading order in the code order
      * Code reflects top to botton, left to right reading order