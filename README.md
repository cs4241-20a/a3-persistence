## My Reading List
Xiaoyue Lyu

https://a3-xiaoyue-lyu.glitch.me


- This application allows authenticated users to create, modify, and delete books from their reading list. It allows users to record the title, author, isbn of a book, as well their reviews of the book and if they have a copy of it. All the data are protected and can only be accessed by logged-in users. Only books added by the user themself will show up on the their reading list, yet the full record of books can be found in /allbooks. Data are permanently saved in MongoDB.
- The biggest challenge I faced was to have a clear understanding of the gap bwteen what I want to make and what I will achieve given the time and ability I have. Writing an application that takes up dozens of files also causes me to jump between files frequently and sometimes lose track of what should come next.
- I chose local strategy for authentication. The main reason is that registering and logging in via an email and password are quite intuitive for me, and it also makes storing and organizing user info in database quite easy.
- I used Bootstrap for my CSS framework since it is the one I am most familiar with. I did not make much custom CSS styling beyond that.
- Passport.js: controls registration and log in.
- session: session middleware can change req.user to currently logged in user; this allows us to check users' identities before letting them access certain routes.
- connext-flash: I use it to display success and error messages to give users clear feedback on their input.
- body parser: parse req.body so that we can access it.
- helmet: helps protect the application from external attacks.
## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- **Tech Achievement 2**In addition to OAuth strategies, I also use EJS for this project. EJS allows developers to display dynamically-created content on the website directly, in my case, I use it to display success and error messages, which provides users clear feedback on their input. Though EJS has a learning curve, overall it makes writing frontend code easier than merely relying on HTML/JavaScript.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative:
- Use headings to convey meaning and structure
- Provide clear instructions
- Provide sufficient contrast between foreground and background
- Ensure that interactive elements are easy to identify
- Provide clear and consistent navigation options
- Ensure that form elements include clearly associated labels
- Provide easily identifiable feedback
- Create designs for different viewport sizes
- Associate a label with every form control
- Identify page language and language changes
