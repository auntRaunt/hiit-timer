HIIT timer 
https://peaceful-coast-01850.herokuapp.com/timer

SETUP/USAGE/HOW TO

1. Client will input the form and click submit
2. Form Data will pass to NodeJS server via post request
3. Response from post route will render the timer page with all data inside to client

CUSTOMIZE/ADDITIONAL

Q1: How I manipulate the logic?
A: When the form is submitted, I use Jquery to serialize the form data in data.js file, and store in sessionstorage.
Then when the response render back the timer.ejs to client, I link the timerTest.js to timer.ejsm and get the data stored in sessionstorage, and run the logic inside timerTest.js.

Q2: What major problem I have encountered during the development?
A. There are lots of major problem, I will list out some.

Problem1: Stacking of data when refresh
Background: At first, when the data send to post route, I let a global variable and saved all data, therefore, the get route can access that global variable, and the timerTest.js can fetch the get route of that global variable.
Since in the early development stage, I have not thought of what will happen if many users clicking the website at the same time, I just want to run the logic of the timer, so although running in my own server works quite well, but when I deploy to public, the problem came out and I worked too long to solve this issue.

Problem2: Pause the timer
Background: You can see inside the timer, there are lots of timer, like the time passed, remaining, currentCountDown and the logic timer. In order to pause all the timer at the same timer, use clearInterval is the solution, however, the current displaying time should retain when user click play again. It also suffers me too long to solve this problem, as how to get back the displaying variables.

Problem3: Using setTimeout
Background: This problem is related to previous problem, as when the timer is passed and played back, the variable return by the timer using setTimeout is too strange and even not work. Therefore, I change all logic using setInterval and it makes me lots of time to design the whole logic again as previous using setTimeout can run but can not pause and play only.






