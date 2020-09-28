
## League of Legends 2020 Worlds Pickems
Truman Larson
https://a3-truman-larson.herokuapp.com/ 

This application provides an interface to submit predicted brackets of the 2020 League World Championship. Users login on the login page and when they create a pickem bracket by choosing who they think will win each match, it is stored for them to reference later. The user may also modify their bracket, which will replace their current bracket with a new bracket, or delete their bracket, which will remove their bracket from the database. Some of the main challenges developing this were primarily conceptualizing how a bracket selection user interface would be able to work and how it would be implemented. The application can utilize both an account created from typing in a new username, or by loggin in through github. The reason I chose to to it this way is because I already had the simple login mechanics functional when I decided to add the github functionality. Additionally there wasn't too much conflict between the github login and my existing system. The CSS framework I used was Marx. I used this because it was class-less and lightweight meaning I wouldn't have to design my application around it and I liked the way that it styled my login page. I did modify the appearence of the table cells that contained teams to make them a bit more distict and I modified the alignment of certain container divs. 

Express middleware packages:
1. body-parser : Helps parse incoming json requests into json.
2. compression : Attempts to compresses response bodies for all requests.
3. passport : External authentication handling through github (with passport-github)
4. static : Automatically maps unmapped GET requests to the path given
5. morgan : Logs all requests to a log file

## Technical Achievements
- **OAuth authentication**: I used OAuth authentication via the GitHub strategy. I also integrated this strategy with my existing login system. To use the github login you must click the Login with github button on the login page.
- **Hosting on Heroku**: Hosting on Heroku seems to work a lot better for me than glitch. This is mainly because I do my development in vs code while commiting to github every once and a while. Heroku has much smoother integration with github and is able to automatically deploy your site when you commit. There is a bit of setup required to do that because you have to transfer your environment variables and formally list all your dependencies and versions but I think it was a much better experience for me.

