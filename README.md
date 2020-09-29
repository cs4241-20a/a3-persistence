Party Guest List
---

<a href="https://www.a3-connor-burri.glitch.me">glitch site</a>

### Description
This project is an attempt to make a comprehensive guest list for party events. It is meant to streamline the process of both adding and verifying whether the guest is of legal 
drinking age, while also maintaining a log of their birthday (in case errors arise) and their gender. This uses a persistent database in the backend to keep track of guests and the 
author of the guest, that way a particular users guest only shows up for them. There are also a handful of middleware packages to simplify and secure the application.


### Known Bugs
- There are some instances where the birthdate, despite being of legal drinking age, will give the wrong result
- Occassionally if you override the drinking age, it will not change immediately, the functionality is there and will work reliably upon a refresh

### Challenges
- The biggest challenge was learning MongoDB. I found it to be less intuitive than other frameworks, but nice that it was cloud enabled so easily
- Github OAuth was another big issue, mainly due to how callbacks work. eventually it made sense though
- Also passing data between client and server was tricky at times. I think this was mainly an issue related to variable scope

### Authentication Strategy
- I decided to go with OAuth authentication using Github. I decided on this because I had struggled with something similar in the past (pertaining to Spotify) and figured it would
be a worthwhile skill to learn. Also I was looking for some bonus points.

### CSS Framework
- I ended up going with Bootstrap because I have experience with this framework and wanted to get to know it a bit more
- Modifications:
    - Some coloring of elements
    - The way that some elements responded to flexbox
  
### Middleware Used
1. **Body-Parser** - Allows for the body of a request to be more readable and usable, especially with JSON
2. **Morgan** - Gives detailed logs of events happening on the server
3. **Helmet** - Gives a good layer of security to the web application
4. **Compression** - Compresses responses being sent to the client, allows for a speedier transaction
5. **PassportJS (Github)** - Gives the ability for users to login using their github account

### Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

### Design/Evaluation Achievements
- **None**
