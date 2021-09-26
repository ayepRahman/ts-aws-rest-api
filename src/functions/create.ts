"use strict";

import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import userValidation from "validations/userValidation";
import userService from "services/userService";

export const createUser: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
  // context: Context,
  // callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const data = JSON.parse(event?.body || "");

    if (!data) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          error: {
            message: "Couldn't create user.",
          },
        }),
      };
    }

    // validate user data

    await userService.checkUserEmailExist(data?.email);

    await userValidation(data);

    return await userService.createUser(
      data?.username,
      data?.email,
      data?.password
    );
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        error: error,
      }),
    };
  }
};
