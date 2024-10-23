import cookie from "js-cookie";

const token_key = "id";

export function setToken(token: string): void {
  cookie.set(token_key, token, {
    expires: 7, // Establece la expiración del token
    secure: true, // Asegúrate de que la cookie solo se envíe sobre HTTPS
    sameSite: "Strict", // O 'Lax' dependiendo de tus necesidades
  });
}

export function getToken(): string | undefined {
  return cookie.get(token_key);
}

export function deleteToken(): void {
  cookie.remove(token_key);
}
