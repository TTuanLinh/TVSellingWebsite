const verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    throw new Error('TURNSTILE_SECRET_KEY is not defined');
  }

  const res = await fetch(verifyEndpoint, {
    method: 'POST',
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await res.json();

  return data.success;
}