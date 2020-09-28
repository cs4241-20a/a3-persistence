
## A3StephenLucas

https://glitch.com/~stephenlucas600-a3

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

the project is the updated todo list from A2 which tracks the item's due dates and the dates it was made. 
The program takes in a text and date input from text and gets the current date, then uplodes it to the MongoDB and updates the table. 
Thier were planed to be more features to check off completed jobs and delet them from table but were scraped due to time and not knowing how to select items in a dynamicly changing CSS table.
As pressed for time and not sure what more to add I quickly add in some middleware packages. body-parser is used by Fetch "/add" and "/delete" to the MongoDB so the request is converted into somehting it understands.
errorhandler is used to handle errors and return a message if lient.connect or fetch /add fails. 
morgan runs every time a button is pushed and prints what action was sent to the server and how long it took.
helmet is a passive middleware package that protects the Express apps by changing alot of the setting in the express to be for secure in one line call.

