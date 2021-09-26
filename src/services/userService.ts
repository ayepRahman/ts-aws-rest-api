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
  const params = {
    // come from serverless.yml environment
    TableName: process.env.DYNAMODB_TABLE || "",
    Item: {
      id: uuidv4(),
      username,
      email,
      password,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  await dynamoDb.put(params).promise();

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(params.Item),
  };
};

const checkUserEmailExist = async (email: string) => {
  console.log("checkUserEmailExist: res", email);
  const params: DocumentClient.GetItemInput = {
    // come from serverless.yml environment
    TableName: process.env.DYNAMODB_TABLE || "",
    Key: {
      email,
    },
  };

  const res = await dynamoDb.get(params).promise();

  console.log("checkUserEmailExist: res", res);
};

export default {
  createUser,
  checkUserEmailExist,
};
