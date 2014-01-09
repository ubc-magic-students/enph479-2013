This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

## Pre-req
1. MySql server
2. Apache Maven
3. MongoDB
4. node.js

## Installation

1. Run `git clone https://github.com/ubc-magic-students/enph479-2013.git`
2. To build Tweet sentiment VS Weather application, go to `algorithm-module` and execute `mvn clean install`.
3. Import `ENPH479 v1.1.0.sql` to MySql.
4. Go to `/node_web_app` and run `npm install`.
5. Go to `/adhocEvents` and run `npm install`.

## How to run

** In order to run both apps, you will need `credentials.js` file that contains access keys to various APIs. Place the credential file inside `/node_web_app` and `/adhocEvents`. Contact UBC-MAGIC-LAB for details.

### Tweet sentiment VS Weather application

1. run jar file by using `java -jar algorithm-module-0.0.1-SNAPSHOT-jar-with-dependencies.jar` in `/algorithm-module/target` foler.
2. in cmd or shell, go to the `/node_web_app` and run `node app.js`
3. go to your favourite browser and type in url: `http://localhost:8090/map`
4. map of Vancouver should appear and twitter feed should start to stream in

### Event detection application
**For the time being, this application does not have UI. The application will run in command line.

1. Run MongoDB server `mongod --dbpath [path to your data storage]`.
2. Go to `/adhocEvents` folder and run `node app.js`.

### Credits
* [Chris Yoon](https://github.com/chris-yoon90)
* [Colin Leung](https://github.com/colinmleung)
* [Richard Li](https://github.com/RileePlus)
