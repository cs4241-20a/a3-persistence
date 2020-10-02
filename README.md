Rate Your Stress

https://a3-victoria-buyck.glitch.me/

The goal of this project is to help people manage their stress by listing activitie sthey can do with the time limit they have.
A challege I faced was working on the middleware packages, and trying to figure out what each of them did.
I choose to use mongoDB for the authentication process as it was the easiest for me to use. I checked the username and password 
user inputs against the usernames and passwords in the collection.
I used the Milligram CSS framework as it was easy to implement and I liked the design. 

The 5 middleware packages I used include: 
body-parser: parses requests in order to make the data more accessible for the JSON
cookie-parser: parses cookie information and creates data for req.cookie based on what is given 
respose-time: displays how long it takes for the request headers to print 
morgan: also displays response time 
timeout: keeps track of whether or not requests timeout and stops the flow of requests if they do 
