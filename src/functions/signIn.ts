import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { cognitoClient } from '@/libs/cognitoClient';
import { bodyParser } from '@/utils/bodyParser';
import { response } from '@/utils/response';
import { InitiateAuthCommand, NotAuthorizedException, UserNotConfirmedException, UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { email, password } = bodyParser(event.body);

    const command = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult) {
      return response(401, { error: 'Invalid Credentials.' });
    }

    return response(200, {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    });
  } catch (error) {
    if (error instanceof UserNotFoundException || error instanceof NotAuthorizedException) {
      return response(401, { error: 'Invalid Credentials.' });
    }

    if (error instanceof UserNotConfirmedException) {
      return response(401, {
        error: 'You need to confirm your account before sigin.',
      });
    }

    return response(500, {
      error: 'Internal Server Error',
    });
  }
}
