import * as AWS from "aws-sdk"; // eslint-disable-line import/no-extraneous-dependencie)
import { APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuidv4 } from "uuid";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const createUser = async (
  username: string,
  email: string,
  password: string
): Promise<APIGatewayProxyResult> => {
  const timestamp = new Date().getTime();
  const params: DocumentClient.PutItemInput = {
    // come from serverless.yml environment
    TableName: process.env.DYNAMODB_TABLE || "",
    Item: {
      id: uuidv4(),
      username: username,
      email: email,
      password: password,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    //TODO: need to figure whil condition expression not working
    ConditionExpression:
      "attribute_not_exists(username) AND attribute_not_exists(email)",
  };

  return await dynamoDb
    .put(params)
    .promise()
    .then((data) => {
      console.log("SUCCESS", data);
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(params.Item),
      };
    })
    .catch((error) => {
      console.log("ERROR", error);
      return {
        statusCode: 400,
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ error }),
      };
    });
};

const checkUserEmailExist = async (email: string) => {
  console.log("checkUserEmailExist", email);
  const params: DocumentClient.GetItemInput = {
    // come from serverless.yml environment
    TableName: process.env.DYNAMODB_TABLE || "",
    Key: {
      email: email,
    },
  };

  const res = await dynamoDb.get(params).promise();

  console.log("checkUserEmailExist: RESPONSE", res);
};

export default {
  createUser,
  checkUserEmailExist,
};
