![example workflow](https://github.com/inkandjabanga/iPulse/actions/workflows/dotnet.yml/badge.svg)

# iPulse
Doctor Appointment and Patient Profile Management Software

# Installation

Install required software:
  - mysql v8.0
  - nodejs v16.16.0
  - npm 8.11.0
  - .NET 6.0 SDK
  
Setup mysql user:
  - create a user --> username: dev   password: Dev@1234
  - grant user all privileges

Clone repository:
  - git clone git@github.com:inkandjabanga/iPulse.git
  
Setup database:
  - cd into iPulse/database
  - run --> cat ./db_setup.sql | mysql -u dev -pDev@1234
  
  or
  
  - cd into iPulse/database
  - run --> mysql -u dev -pDev@1234
  - in mysql cli run --> source ./db_setup.sql
  
Install packages:

  Front-end
  - cd into iPulse/front-end
  - run --> npm install
  
  Back-end
  - cd into iPulse/back-end
  - run --> dotnet restore
  
# Test
  Back-end
  - cd into back-end-test
  - run --> dotnet test --logger "html;logfilename=testResults.html"

# Run
 Front-end
  - cd into iPulse/front-end
  - run --> npm start
  
  Back-end
  - cd into iPulse/back-end
  - run --> dotnet run



  
