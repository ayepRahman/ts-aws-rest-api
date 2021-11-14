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

## AWS API Gateway

- AWS Lambda + API Gateway: No infrastructure to manage
- Support for the WebSocket Protocol
- Handle API versioning
- Handle diff env
- Handle security
- Create API keys, handle request throltling
- Swagger / Open API import to quickly define API's
- Transform and validate request and response
- Generate SDK and API specification
- Cache API responses

### API Gateway - Integrations High Level

- Lambda Function
  - Invoke Lambda function
  - Easy way to expose REST API backed by AWS Lambda
- HTTP
  - Expose HTTP endpoint in the backend
  - Example: internal HTTP API on premise, Application Load Balancer
  - Why? Add rate limiting, caching, user authentications, API keys ec...abs
- AES Service
  - Expose any AWS API through API Gateway?
  - Exmaple: start an AWS Step Function workflow, post a message to SQS
  - Why? Add authentication, deploy publicly, rate control..

## API Gateway - Endpoint Types

- Edge-Optimized (default): For global clients
  - Request are routed through the CloudFront Edge Locations (improves latency)
  - The API Gateway still lives in only one region
- Regional
  - For clients within the same region
  - Could manually combine with CloudFront (more control over the caching strategies and the distribution)
- Private:
  - can only be accessed from your VPC using an interface VPC endpoint (ENI)
  - Use a resource policy to define access

## API Gateway - Deployment Stages

- Making changes in API Gateway does not mean they effective
- You need to make a deployment for them to be in effect
- It's a common source of confusion
- Changes are deployed to "Stages" (as many as you want)
- Use the naming you like for stages (dev, test, prod)
- Each stage has its own configuration parameters
- Stages can be rolled back as a history of deployment is kept

## API Gateway - Stage Variables

- Stage variables are like environtment variabels for API Gateway
- Use them to change often chaging configuration values
- They can be used in:
  - Lambda function ARN
  - HTTP Endpoint
  - Parameter mapping tempaltes
- User cases:
  - Configure HTTP endpoints your stages talk to (dev, test, prod)
  - Pass configuration parameters to AWS Lambda through mapping templates
- Stage variables are passed to the "context" object in AWS Lambda

Caching API responses

- Caching reduces the number of calls made to the backend
- Default TTL (time to live) is 30 seconds (min: 0s, max: 3600s || 1hr)
- Caches are defined per stage
- Possible to override cache setting per method
- Cache encryption option
- Cache capacity between 0.5GB to 237GB
- Cache is expensive, make sense in production, may not make sense in deve/ test

## API gateway - Usage PLans & API Keys

- If you want to make an API available as an offering ($) to your customers
- Usage Plan:
  - who can access one or more deployed API stages and methods
  - how much and how fast they can access them
  - uses API keys to identify clients and meter access
  - configure throttling limits and quota limits that are enforced on individual client
- API Keys:
  - alphanumeric string values to destribute to your customer
  - can use with usage plans to control access
  - Throttling limits are applied to the API keys
  - Quotas limits is the overall number of maximum requests

## API Gateway - Correct Order for API keys

- To configure a usage plan

  1. Create one or more API's, configure the methods to require an API key, and deplpy the APIs to stages
  2. Genrate or import API keys to distribute to application develops (your customers) who will be using your API
  3. Create the usage plan with the desired throttle and quota limits
  4. Associate API stages and API keys with the usage plan

- Callers of the API must supply an assinged API key in the "x-api-key" header in request to the API.

## AWS Api Gateway - CORS

- CORS ust be enabled when you receive API calls from another domain.
- The OPTIONS pre-flight reqwuest must contain the follwoing headers:
  - Access-Control-Allow-Methods
  - Access-Control-Allow-Headers
  - Access-Control-Allow-Origin

## API Gateway - Security IAM Permissions

- Create an IAM policy authorization and attach to User/ Role
- Authentication = IAM | Authorization = IAM Policy
- Good to provide access within AWS (EC2, Lambda, IAM users...)
- Leverages "Sug v4" capability where IAM credential are in headers

## API Gateway - Security Cognito User Pools

- Cognito fully manages user lifecycle, token expires automatically
- API gatway verifies identiry automatically from AWS Cognito
- No custom implementation required
- Authentication = Cognito User Pools | Authorization = API Gateway Methods

## API AGteway - Security Lambda Authorizer (formerly Custom Authorizers)

- Token base authorizer (bearer token) - ex JWT or 0Auth
- A request parameter-based Lambda authorizer (header, query string, stage var)
- Lambda must return an IAM policy for the user, result policy is cached
- Authentication = Externa; | Authorization = Lambda function

## API Agteway - WebSocket API - Overview

- What's WebSocket?
  - Two-way interactive communication between a client and server (Persistent connection)
  - Server can push information to the client
  - This enables stateful application user cases
- WebSocket APIs are often used in real-time application such as chat applications, collaboration platforms, etc....
- Works with AWS Services (Lambda, DynamoDB) or HTTP endpoint

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
