Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 28th, by 11:59 PM.

## To-Do List and Your Work Advisor

Pradnya Mahurkar: https://a3-pradnya-mahurkar.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:
My project can be used for creating a to-do list. It allows the user to add/delete/modify the tasks too. It uses the express server and uses the mongoDB database to store the tasks. I have a login to the webpage so that the user can save the tasks that he/she need to store their tasks. The user automatically registers if he or she does not already have an account. The table at the bottom of the page shows the tasks for a particular user. I have also implemented some accessible friendly features which are listed in the achievements section.

- the goal of the application: The goal of the application is to help the user create a to-do list.
- challenges you faced in realizing the application: the biggest challenge that I faced was creating the login. I had no prior experience creating a login page, so I had to figure out how to do that. 
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable): I couldn't implement oauth github, but I did the basic mongodb authentication because it was easier to implement.
- what CSS framework you used and why
I used the CSS framework called water. I used it because it had a clean and basic design that I needed for my to-do list website.
  - include any modifications to the CSS framework you made via custom CSS you authored
  I did not change any of the actual code in the CSS framework. However, I did change the color of some of my labels using HTML so that I could make the website more accessible. 
- the five Express middleware packages you used and a short (one sentence) summary of what each one does
1. bodyParser: I used it to parse the HTTP requests.
2. helmet: to help secure my app
3. compression: to compress http responses
4. morgan: to log requests
5. errorhandler: development error handing

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative:
Writing for Web Accessibility:
- Provide informative, unique page titles: The page has a main title and subtitles for every section of the webpage.
- Use headings to convey meaning and structure: The main heading explains the use of the webpage i.e. it is a to-do list and also gives you advice regarding your to-do list
- Make link text meaningful: I have 1 link in the webpage which gives the users expert advice about how to use a todo list. I gave the hyperlink the name of the article so that the user has a fair idea about what to expect after clicking on the hyperlink.
- Provide clear instructions: Every field of the form has instructions regarding the entry in that particular field.
- Write meaningful text alternatives for images: I have included 1 image in the webpage which shows the user how to use the radio buttons (in case they have no prior experience of using them). The image has an alternative text/ caption which explains the image.
- Keep content clear and concise: The content in the webpage is clear and concise. I used short, clear sentences and paragraphs throughout the webpage. I did not use any unnecessary or complicated words. I also used images in the radio buttons to clarify the meaning of the different types of priorities.

Designing for Web Accessibility
- Provide sufficient contrast between foreground and background: There is a good contrast in the webpage. The background is white and the text is darkgrey and sometimes red (indicating a madatory field in the form).
- Don’t use color alone to convey information: I used color and an * to convey mandatory fields. Just like the example shows on https://www.w3.org/WAI/tips/designing/
- Ensure that form elements include clearly associated labels: All the buttons have labels indicating their functionality and all the fields in the form have labels indicating the value to be entered in the field. 
- Use headings and spacing to group related content: Every section has a heading heading2 tag to it. It sepeates the login section from the form section and the form section from the to-do list section.
- Include image and media alternatives in your design: I added images indicating the priority as an alternative to the text in the radio buttons
  
Developing the Web Accessibility
- Associate a label with every form control: Every form control has a label on the webpage

- **Design Achievement 2**: 
Which element received the most emphasis (contrast) on each page?

In the webpage, I used a very basic black and white theme. I had to get emphasis on the mandatory fields, so I made their labels bright red and added * to them. Additionally, I wanted the user to not miss the form on the page, so I used the heading2 tag in HTML to make it big and bold. This would attract the user attention. Additionally, my CSS template gives a gray background to the fields which have to filled up by the user, this makes sure that the user does not miss them. The most emphasis on the page is on the title. The title has a heading1 tag which makes it the biggest and boldest on the page and attracts the most attention. The heading should receive the most emphasis since it tells the user the function of the webpage.

How did you use proximity to organize the visual information on your page?

I used proximity to organize the visual information on my page by adding headings with the tag heading2 on my webpage. This gives the user an impression that the page is divided into 3 chunks: Login, the to-do form, and the To-do list in the form of the table. Additionally, the table helps get similar information, in my case: the users’ tasks, together. Whenever the user adds a task using the form, a row is added to the table and the information stays organizes and in one place separated by columns. Lastly, 2/3 sections: Login and To-Do form have buttons towards the end of their section, which means that the user fills up a form and is done with a particular section of the page. 

What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site?

I used a similar layout for both my forms (the login and the to-do form). The labels of the form were bold, and the entry field of the form was grey. All the buttons, including the “delete” and “update” buttons in the to-do table had similar designs too, they were of similar sizes, had a grey background, and had labels to them indicating their function. All the required fields in the form were red, bold, and marked with an asterix. All the sections of the webpage used similar text and heading fonts too. Every section heading had a heading2 tag. I used similar design elements throughout the webpage because it made the website look uniform. The uniformity gave the user a general idea of the layout of the website.

How did you use alignment to organize information and/or increase contrast for particular elements?

The entire website is left-aligned. This made the website look clean, clear, and sophisticated. The main heading is aligned to the left side of the screen, it has the biggest and boldest font on the screen. The heading had to be organized in such a way because it explains the user the function of the website. Next, the subheadings were a little smaller compared to the main heading. They were also left-aligned so that the user would not have to change their point of focus and simply scroll through the website. All the text, forms, and buttons are also left aligned so that that the user won’t have to move his/her cursor around too much. However, I have the button labels aligned to the center of the button so that it would look neat and not clustered towards the left.

