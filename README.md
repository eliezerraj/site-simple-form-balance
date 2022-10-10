# site-simple-form-balance
crud form html

1) Create lambda function - lambda-simple-form-balance (nodejs)
2) add Dynamo Full Access Policy

Lambda-test
GET-ID
{
  "httpMethod": "GET",
  "resource": "/balance/{id}",
  "pathParameters": {
    "id": "1"
  }
}

POST
{
  "httpMethod": "POST",
  "resource": "/balance/save",
  "body": {
    "balance_id": "bal-1",
    "account": "acc-888",
    "amount": "8",
    "description": "description-888",
    "id": "1"
  }
}