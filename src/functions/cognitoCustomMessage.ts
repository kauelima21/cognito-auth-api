import { CustomMessageTriggerEvent } from 'aws-lambda';

export async function handler(event: CustomMessageTriggerEvent) {
  const code = event.request.codeParameter;
  const givenName = event.request.userAttributes.given_name;
  // const email = event.request.userAttributes.email;

  if (event.triggerSource === 'CustomMessage_SignUp') {
    event.response.emailSubject = `Falta pouco ${givenName}! Confirme sua conta`;
    event.response.emailMessage = `<h1>Bem-vindo(a) ${givenName} </h1>
    <br />Use este código para confirmar a sua conta: ${code}`;
  }

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    event.response.emailSubject = 'Recuperação de conta';
    event.response.emailMessage = `<h1>Olá ${givenName} </h1>
    <br />Use este código para recuperar a sua conta: ${code}`;
  }

  return event;
}
