import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm";

const client = new SSMClient({});

// Set the prefix of the parameters to retrieve
const prefix = "/cpss/algolia";

// Set the options for the GetParametersByPathCommand
const input = {
  Path: prefix,
  WithDecryption: false,
  Recursive: true,
};

// Create the GetParametersByPathCommand
const command = new GetParametersByPathCommand(input);

// Send the command to the SSM service
const response = await client.send(command);

// Log the response
console.log(response);