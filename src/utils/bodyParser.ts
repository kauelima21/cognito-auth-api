type Body = Record<string, any>;  

export function bodyParser(body: string | undefined): Body {
  try {
    return JSON.parse(body ?? '');
  } catch {
    return {};
  }
}
