# Mail_Automation
This project was a part of an assessment for Backend Internship by listed. In this project I devloped a Node.js based app that is able to respond to emails sent to your Gmail mailbox while you’re out on a vacation. 

## Features
1. Login using Google [http://localhost:8000/api/google/login](http://localhost:8000/api/google/login)
2. Automatic replies to all the unread messages receiving for the first time. [http://localhost:8000/api/mailReply](http://localhost:8000/api/mailReply)
3. Automatically add labels to the replied messages .
4. Logout using Google [http://localhost:8000/api/google/logout](http://localhost:8000/api/google/logout)

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





   
