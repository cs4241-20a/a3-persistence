Readme
---

## Your Web Application Title

Glitch link https://a3-zhechengsong.glitch.me

1. This application is a modified version of a TODO List which I did in last assignment, with mewly implementedf express server and mongodb database. The basic feature stays almost the same. You can add new task via entering task detail, priority, start time, the system would calculate the due time for you based on priority and show the task in the task list. You can delete the task by clicking the 'x' button, or edit it by clicking 'edit' at the right-end of the task.
2. I had some trouble figuring out how to use mongodb with adding, getting, and updating data. But I figured it out after watch the video and doing some research online.
3. I wanted to use username and password login which is simple and easy to manage but I really couldn't figure out how to add passport to express...
4. I used sanitize.css because it's said to be a css format which would stay the same among different broswers. I still added a google font, and made some changes like make the form stays in middle, and customized the list item within task list.
5. - body-parser: used to deal with data and turn them into json
   - morgan: used to put useful log like user request, useful on debugging
   - errorhandler: used during development for better error tracing (deleted in final product)
   - cors: used to enable all CORS request for user
   - timeout: add a timeout to all request via 10s

## Technical Achievements
