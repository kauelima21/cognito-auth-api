import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { 
  SignUpCommand, 
  UsernameExistsException 
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/libs/cognitoClient';
import { bodyParser } from '@/utils/bodyParser';
import { response } from '@/utils/response';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = bodyParser(event.body);

    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: body.email,
      Password: body.password,
      UserAttributes: [
        { Name: 'given_name', Value: body.givenName },
        { Name: 'family_name', Value: body.familyName },
      ]
    });

    const { UserSub: userId } = await cognitoClient.send(command);

    return response(201, { userId });
  } catch (error) {
    if (error instanceof UsernameExistsException) {
      return response(409, {
        error: 'This e-mail is already in use.',
      });
    }

    return response(500, {
      error: 'Internal Server Error',
    });
  }
}
