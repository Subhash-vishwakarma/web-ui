[![Build Status](https://travis-ci.com/Enterprise-connect/web-ui-admin.svg?branch=v1.1beta)](https://travis-ci.com/Enterprise-connect/web-ui-admin)

# web-ui
- EC Web UI based on Bootstrap and REACT.

## Runtime Requirement:
* Agent v1.1beta [#1686+](https://github.com/Enterprise-connect/ec-x-sdk/releases/tag/v1.1beta.fukuoka.1686)
* [Browser compatibility matrix](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Browser_compatibility)

## Development Requirement:
* [Facebook REACT v16+](https://reactjs.org/docs/getting-started.html#try-react)
* [Bootstrap UI v4.3.0+](https://getbootstrap.com/docs/4.3/getting-started/download/)
* EC Agent v1.1beta v1686+
  * [You may download an agent artifact for your supported OS other than linux](https://github.com/Enterprise-connect/ec-x-sdk/tree/v1.1beta/dist)
  * [Visit agent repo for usage](https://github.build.ge.com/Enterprise-Connect/agent/tree/v1.1beta#oauth2-authentication-provider) 


### How to run
```shell
#get the agent binary
wget -O ./webui_linux_sys.tar.gz https://raw.githubusercontent.com/Enterprise-connect/sdk/v1.1beta/dist/webui/webui_linux_sys.tar.gz \
  && tar -xvzf ./webui_linux_sys.tar.gz

#clone the repo
git clone --recursive <xcalr-webui-repo>

#launch the app
./webui_darwin_sys -mod api -pks <private-key> -pbk <certificate> -oa2 http://localhost:17991 -app ec

#Or simply do a docker run. you may follow the example ```--env-file``` below
#https://github.com/Enterprise-connect/oci/blob/v1.1beta/spec/web-ui/run.env
docker run -p 17990:17990 -p 17991:17991 --env-file run.env -it enterpriseconnect/webui:v1.1beta
```
### First time launch the app
If this is your first time launch your app developmet in agent API mode, please visit [the agent in API mode for more details](https://github.build.ge.com/Enterprise-Connect/agent/blob/v1.1beta/README.md#launch-agent-for-connectivity-via-api-endpoints)

### First time launch OAuth2
If this is your first time launch agent in OAuth2, please [refer to the agent docs.](https://github.build.ge.com/Enterprise-Connect/agent/blob/v1.1beta/README.md#first-launch)

### How to browse
```
open http://localhost:17990/v1.1beta.fukuoka.1686/webui
```

### Development WIP
![OAuth2 login](docs/oauth_login.png?raw=true)

![OAuth2 flow](docs/oauth_scope.png?raw=true)

**UI example (not the current development for xcalr UI)**

![UI example](docs/ecUIDashboard.png?raw=true)

### Unit Tesing
Unit testing is a way of testing the smallest piece of code (Components) that can be logically isolated in a system. It is mainly focused on the functional correctness of standalone modules.

### Package Used For Unit Testing
Jasmine

Jasmine is an open-source JavaScript framework, capable of testing any kind of JavaScript application. Jasmine follows Behavior Driven Development (BDD) procedure to ensure that each line of JavaScript statement is properly unit tested.
Official Doc @ https://jasmine.github.io/

### How To Do Unit Test
Step 1. Go to project folder in terminal.
Step 2. run npm install  (If you are doing for first time. That will create and install all the dependent packages used for unit testing)
Step 3. run npm test (It will automatically run the test cases and produce the result)

### Example Result From Unit Test
![Demo test result](docs/Unittest/unit_test_result.PNG?raw=true)

### Automation Testing
Automation Testing is the process of using the assistance of tools, scripts, and software to perform test cases by repeating pre-defined actions. Test Automation focuses on replacing manual human activity with systems or devices that enhance efficiency.

### Package Used For Automation Testing
Protractor

Protractor is an end-to-end test framework for applications. Protractor runs tests against your application running in a real browser, interacting with it as a user would.
Official Doc @ https://www.protractortest.org/

### How To Do Automation Testing
Step 1. Go to project folder in terminal.
Step 2. Run npm install  (If you are doing for first time. That will create and install all the dependent packages used for automation testing)
Step 3. Open project-folder/protractor/todo-spec.js. Find "place your login id" and replace with your login id and find "Place your login password" and replace with your password.
Step 4. Open one terminal at project-folder/protractor and run webdriver-manager update after that run webdriver-manager start at the same terminal ( do not close this terminal).
![Demo webdriver-manager update and start](docs/Automationtesting/webdriver-manager.png?raw=true)
Step 5. Open another terminal at project-folder/protractor and run protractor conf.js (it will start testing the application and opens the browser automatically)

### Example Result From Automation Testing
![Demo automation test result](docs/Automationtesting/protractor-result.png?raw=true)

### Topology Graph
Package used: Vis.js
Official Website: https://visjs.org
Implementaion Help: https://visjs.github.io/vis-network/examples/network/basic_usage/standalone.html
![Demo Topology graph implemeted in project](docs/topology_graph.PNG?raw=true)

### Reference:
- OAuth2 Provider UI by the agent:
https://github.build.ge.com/Enterprise-Connect/oauth2-webui
- EC Agent sdk:
https://github.com/Enterprise-connect/ec-x-sdk/releases/tag/v1.1beta.fukuoka.1686
- xcalr APIs: (non-TLS)
http://demo-ec-531885193.us-east-2.elb.amazonaws.com/v2beta/swagger-ui.html
