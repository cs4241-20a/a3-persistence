## A3-Xiaowei Chen
		

		your glitch (or alternative server) link e.g. https://a3-xchen0326.glitch.me/
		

## Important！！！Things to notice in order to sucessfully run my application!
		- To delete or modify the results, you need to click the button "Starting to delete or modify" first every time you refresh the page, and then click on the delete or modify button. If you did not click the "Starting to delete or modify" button, the edits on the results will be unsuccessful!


Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:
		

- the goal of the application: 
		The goal is to practice the skills of using express in node.js, assisted by other middlewares and mongodb. I also learnt how to use oauth in this assignment 
		- challenges you faced in realizing the application: 
		There are many challenges that I faced during this assignment. The first is the time limit. Because of another CS course, I only had 3 and a half days to do this assignment. Also, I met many wierd bugs like cannot insert things into mongodb, getting bad credentials from oauth. etc. Glad that I solved all the problems and get my application work well. 
		- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable): 
		The authentication strategy I chose is passport-github, using oauth2.0 from github to authroize users to log in. I chose this strategy as it is the easiest way to implement as I can let github do all the work. 
		- what CSS framework you used and why: 
		I used bootstrap to serve the layout as it is one of the most famous frameworks in CSS, and it is quite simple to use. 
		- the five Express middleware packages you used and a short (one sentence) summary of what each one does: 
		Here are the five middlewares I used: express(is a minimal and flexible Node.js web application framework that provides a robust set of features to develop web and mobile applications), passport( authenticate requests), passport-github( authenticate requests especially for github), body-parser( automatically generate json) and connect-timeout( check if the server does not respond for a certain length of time). 
## Technical Achievements
		- **Tech Achievement 1**: 
		I used OAuth authentication via the GitHub strategy. People can directly log into my application using their github account. If they do not have a github account, github provides the service to create it.
### Design/Evaluation Achievements
		- **Design Achievement 2**: 
		Contrast is one of the most effective ways to add visual interest to your page and to create an organizational hierarchy among different elements. The Principle of Contrast states: Contrast various elements of the piece to draw a reader’s eye into the page. This implies that, the contrast principle can help applications become easy to attract the users’ attention and let them be more focused on the content. The sharp contrast among colors make people get stick to the pages. In my application, I used the contrast principle. I mainly used two colors: light yellow and black. These two colors are demonstrated in textbook and are marked as highly contrast. By making the background colors of my application so contrast, I can keep the users staying on my web for more time. 
		The Principle of Repetition states: Repeat some aspect of the design throughout the entire piece. The repetitive element may be a bold font, a thick rule (line), a certain bullet, design element, color, format, spatial relationships, etc. It can be anything that a reader will visually recognize. Because of repetition, the users may have a deep impression about some contents. By doing this, I can have the users remember things that I want them to remember. This is a powerful psychology influence achieved by intentional web layout design. In my application, I used the repetition as well. The font size of the texts is repeated, the format of the layout is repeated (bootstrap design), and so on. Also, the result displaying part has multiple lines and each is almost the same. By doing this, the users can easily notice the result displaying part and do edits on it. 
		Here is what to pay attention to alignment: Nothing should be placed on the page arbitrarily. Every item should have a visual connection with something else on the page. The principle of alignment forces us to be conscious. If things are random displayed, it makes no sense and certainly make users feel pretty bad. When people write papers, they emphasize on logic, and it is the same to web layout design. In my application, items have a connection with things else. For example, I have an information header which categorizes all the results. Under the header there are different types of results (name, gender, current year and expected graduation year), and there is a clear connection between the header and the results. Also, if you look at the page, there are two main parts. One is the submit form and the other is the results displaying form. In the submit form, the elements are related together. The submit button is under the three input boxes, meaning that button is used to submit inputs. 
		The Principle of Proximity states: Group related items together. Move them physically close to each other so the related items are seen as one cohesive group rather than a bunch of unrelated bits. In my application, the results are displayed row by row, so each result list is a whole and are related together as a group.
