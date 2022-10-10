'use strict';

const AWS = require("aws-sdk");
const table_name = "balance";
const dynamo = new AWS.DynamoDB.DocumentClient();
  
exports.handler = async (event, context) => {
  console.log("inicio lambda-simple-form-balance v1.0");
  console.log("event.resource.....:", event.resource);
  console.log("event.httpMethod...:", event.httpMethod);
  console.log("event.pathParameters...:", event.pathParameters);

  let payload;
  let body;
  let requestBody;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin" : "*"
  };

  try {
    switch (event.httpMethod) {
      case "DELETE":
        await dynamo
          .delete({
            TableName: table_name,
            Key: {
              id: event.pathParameters.id
            }
          }).promise();
        body = "Delete item Success :";
        break;
      case "GET":
        if (event.resource == "/balance/{id}") {
          body = await dynamo
          .get({
            TableName: table_name,
            Key: {
              id: event.pathParameters.id
            }
          }).promise();
        break;
        } else if (event.resource == "/health") {
          body = {status : true};
        } else if (event.resource == "/info") {
          body = {id: "lambda-simple-form-balance", region: process.env.AWS_REGION };
        } else if (event.resource == "/header") {
          body = event.headers;
        } else {
          body = await dynamo.scan({ TableName: table_name }).promise();
        }
        break;
      case "POST":
        if (!event.body) {
            body = "Payload Invalid";
            break;   
        }    
        //console.log("typeof...:", typeof event.body);
        requestBody = JSON.parse(event.body); // THROUTH APIGW
        //requestBody = event.body; // THROUGH LAMBDA TEST
        //console.log("requestBody...:", requestBody);

        payload = {
            TableName:table_name,
            Item:{
                "id":           requestBody.id,
                "balance_id":   requestBody.balance_id,
                "account":      requestBody.account,
                "amount":       requestBody.amount,
                "description":  requestBody.description,
            }
        };
        
        console.log("payload...:", payload);
        await dynamo.put(payload).promise();
        body = payload;
        break;
      case "PUT":
        if (!event.body) {
            body = "Payload Invalid";
            break;   
        }    
        //console.log("typeof...:", typeof event.body);
        //requestBody = JSON.parse(event.body); // THROUTH APIGW
        requestBody = event.body; // THROUGH LAMBDA TEST
        //console.log("requestBody...:", requestBody);

        payload = {
            TableName:table_name,
            Item:{
                "id":           requestBody.id,
                "balance_id":   requestBody.balance_id,
                "account":      requestBody.account,
                "amount":       requestBody.amount,
                "description":  requestBody.description,
            }
        };
        
        console.log("payload...:", payload);
        await dynamo.put(payload).promise();
        body = payload;
        break;
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  console.log("fim...");
  return {
    statusCode,
    body,
    headers
  };
};