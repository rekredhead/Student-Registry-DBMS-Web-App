# Student-Registry-DBMS-Web-App
![image](https://user-images.githubusercontent.com/98590275/192080319-e052c979-b617-415f-ba2f-6de5f47e89b5.png)

Uses HTML, CSS and Javascript on the Front End. Uses Node.js, Express and MySQL on the Back End. Web App uses CRUD operations to create, update, delete and reset student data records and display data in the form of a table

The Web App DOES NOT run with 'Go Live' on VSCode.
1. Install Node.js on the device.
2. Enter 'npm init' on the VSCode terminal => create the package for the app
3. Enter 'npm install --save mysql express' on terminal => installing mysql and express onto the package (Cannot run the app otherwise)
4. Run the server using 'node server.js'

server.js is the main file that should be executed.
1. createdb.js creates the database and the table if they don't already exist and exports the connection to connection.js
2. connection.js initiates the connection to the MySQL database and exports the connection to Router.js
3. Router.js handles all the server requests (fetch data, etc.) using Express.js Framework (Easier than HTTP module)
4. Router.js initialially sets up the Front End Webpage from the 'client-side' directory at 'http://localhost:3000/'
5. server.js creates the server/API on 'localhost:3000/'

Enter 'npm install nodemon' on the terminal to constantly run the node server without having to restart it everytime.
