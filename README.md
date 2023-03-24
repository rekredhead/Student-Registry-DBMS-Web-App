# TODO
- Upload Server to an AWS VM to host publicly - watch fireship how to deploy node.js app
- Make WebApp responsive for mobile devices
- Send error responses from router to frontend
    - Make script.js display those errors to user (eg: Phone Number already exists)
- Edit menu bar to have add, update, ..., insert column, delete column options
    - Clicking on add, update,... buttons opens the student data input boxes section
    - Click on insert, delete column,... opens section in same menu bar but has inputs to create/delete columns
    - Use this method to add the alter table query in the server code
- Implement same code but with different technologies (Svelte, Nextjs, React, Vue, Solid, MongoDB, GraphQL, Remix, electron, flutter, react native, tauri) => For Experimenting on different tech

# How to setup and run server
1. Install and setup Node.js on your device
2. Install and setup MySQL on your device (Keep a note of your host, user, password and port details in MySQL)
3. Create a GitHub account (ignore if you already have an account)
4. Install and setup Git on your device and use your GitHub email if you have a GitHub account
5. Open an empty folder using a code editor or IDE
6. Initialize the folder as a node project => Run 'npm init -y' on the terminal
7. Initialize the folder as a git project => Run 'git init' on the terminal
8. Use the GitHub repository for the project => Run 'git remote add origin https://github.com/rekredhead/Student-Registry-DBMS-Web-App.git' on the terminal
9. Set the branch of the git project => Run 'git branch -M master' on the terminal
10. Pull the code from the repository => Run 'git pull' on the terminal
    - If there are issue try: 'git pull -u origin master'
11. Install all the modules => Run 'npm install cors dotenv express mysql' on the terminal
12. Create a .env file in the main project directory
13. Copy-paste the following code in the .env file and replace the brackets accordingly
```
PORT=<available-port-number-in-your-device-4digits>
DB_PORT=<mysql-port-number>
DB_HOST=<mysql-host-name>
DB_USER=<mysql-user-name>
DB_PASSWORD=<mysql-password>
```
14. Run the server => Run 'npm start' in the terminal
15. Open the link generated on the terminal on your browser

# Project Description
A Student Management Web Application, where you can add, update, delete and search student details, present in the table. You can delete all data in the table as well.
- Frontend => HTML | CSS | JavaScript
- Backend => Nodejs | Expressjs
- Database => MySQL

This is my very JavaScript project without any knowledge of Web Development (not even HTML lol).
