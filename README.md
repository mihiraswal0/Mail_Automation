# Mail_Automation
This project was a part of an assessment for Backend Internship by listed. In this project I devloped a Node.js based app that is able to respond to emails sent to our Gmail mailbox while we’re out on a vacation. 

## Features
1. Login using Google [http://localhost:8000/api/google/login](http://localhost:8000/api/google/login)
2. Automatic replies to all the unread messages receiving for the first time. [http://localhost:8000/api/mailReply](http://localhost:8000/api/mailReply)
3. Automatically add labels to the replied messages .
4. Repeatdly check for unread messages after a certain period of time.
5. Logout using Google [http://localhost:8000/api/google/logout](http://localhost:8000/api/google/logout)

### Technologies

1. Runtime Server: Node js
2. Framework: Express js
3. Dependencies: express, axios, google-auth,
4. Api:  Gmail Api

### Prerequisites

You need to have `Node.js` and `npm` installed on your machine.

## Installing

1. Clone the repository.
```
git clone https://github.com/mihiraswal0/Mail_Automation.git
```
2. Install the required dependencies
```
npm install
```
3.Run the project
```
npm start
```
4. Link for website
```
http://localhost:8000
```
5. Api call for login
```
http://localhost:8000/api/google/login
```
6.Api call for automatic mail reply
```
http://localhost:8000/api/mailReply
```
7.Api call for logout
```
http://localhost:8000/api/google/logout
```

### Area of improvement:
1. Optimising and minimising api calls to avoid reterival of same data and improving the performance.
2. Introducing  a way to filter the messaeges and to reply them with a particular messages
3. To determine messages that has to be ignored
