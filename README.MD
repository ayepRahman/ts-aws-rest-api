# AWS serverless

## Destroying the Service

- Problem - we need to clean up
  - Function
  - Dependencies of the function
  - CloudWatch Log Group
  - IAM Roles
  - Everything else the framework has created
- Serverless solve these problem for us!

## IAM Permission for Lambda functions

- Our lambda functions access other services
  - For e.g S3 to store images
  - Or DynamoDB to store and retrieve data
- By default our Lmabda function are not authorized to do that
- So for this, we provide an IAM policy
- IAM allows you to entirely secure your AWS setup

## VPC for Lambda functions

- VPC are Virtual Private Clouds
  - Many companies use VPC to prevately deploy their applications
  - By default Lambda functions are not launched ina VPC
- But you can launch Lambda in your VPC, so that:
  - Your Lambda functions can securely access your EC2 instances
  - Your Lambda functions can securely access your RDS instances
  - In fact, any other instance in your VPC!
- You can also assing security groups to your Lambda functions as well for enchanced network security!

### Serverless Command Line

- config - serverless config credentials --provider aws --key <ACCESS_KEY> --secret <SECRET_KEY> --profile <PROFILE_NAME or USER created for AWS> e.g"serverless-admin"
- create a lambda function - `$ sls create --template aws-nodejs --path <name of the function> e.g hello-world`
- deploy a lambda stack - `$ sls deploy --verbose`
- deploy a function - `$ sls deploy function -f <function-name>`
- invoke local - `$ sls invoke local -f <function-name> -l --path lib/data.json`
- invoke & logs - `$ sls invoke -f hello -l`
- logs - `$ sls logs -f <function-name> -t`
- destroying lambda - `$ sls remove`

### Core Concept of DDB - Tables, Items, Attributes, Indexes

- Tables are a collection of Items
- Items are collections of Attribute, or key/value pairs
- Primary Key consist of Partition Key & Sory Key
- Global Sencondary Index, allow us to scan query with reducing cost of reading/updating
- Attribute can store JSON, number, boolean, string, Array

## DDB Tables config details

- If PARTITION KEY is unique we dont need sort else, it good to include SORT KEY
- Read/Write capacity
  - "On-Demand" is expensive but easier to manage
  - "Provisioned" - manual define the capacity for cost effective and computation
- Time to Live, automatically evict data from table by setting timestamp. Gurantee 48hrs

## Lambda Best Practices

- Perform heavy-duty work outside of your function handler
  - Connect to database outside of your function handler
  - Initialize the AWS SDK outside of your function handler
  - Pull in dependencies of databsets outside of your function handler
- Use environtment variables for:
  - Dataase Connection Strings, S3 cuket etc... dont put these values in your codde
  - Paswords, sensitive values... they can be encrypted using KMS
- Minimize your deployment package size to ites runtime necessities
  - Break down the function if need be
  - Remember the AWS lambda limits
  - User Layers where necessary
- Avoid using recursice code, never have a Lambda function call itself

### Hints

- To view endpoint url - api gateway > stages
- Issue with Not able to find Resouce - check trace in cloudformation, check variable in serverless yaml file is correct OR delete cloud formation stack and redeploy

## Known issues

- absolute import - https://github.com/microsoft/TypeScript/issues/10866

## Links

- DDB - https://www.youtube.com/watch?v=2k2GINpO308

## General Ref

- ARNs - Amazon Resource Names
- ECS - Amazon Elastic Container Service
- S3 - Simple Storage Service
- SNS - Simple Notification Service
- SQS - Simple Que Service
- VPC - Virtual Private Cloud
