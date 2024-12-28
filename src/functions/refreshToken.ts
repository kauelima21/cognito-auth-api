import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { cognitoClient } from '@/libs/cognitoClient';
import { bodyParser } from '@/utils/bodyParser';
import { response } from '@/utils/response';
import { InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { refreshToken } = bodyParser(event.body);

    const command = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'REFRESH_TOKEN',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult) {
      return response(401, { error: 'Invalid Credentials.' });
    }

    return response(200, {
      accessToken: AuthenticationResult.AccessToken,
    });
  } catch (error) {
    return response(500, {
      error: 'Internal Server Error',
    });
  }
}
