import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';

const key = 'anket';
const encodedKey = new TextEncoder().encode(key);

// Function to encrypt the payload and create a JWT
export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Set expiration to 7 days
    .sign(encodedKey);
}

// Function to decrypt and verify the JWT session
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Failed to verify session');
  }
}

// Function to create a session and set the cookie
export async function createSession(userToken: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userToken, expiresAt: expiresAt.getTime() / 1000 }); // Storing as UNIX timestamp

  cookies().set({
    name: 'session',
    value: session,
    httpOnly: true,
    secure: true,
    expires: expiresAt, // Date object for the cookie expiry
    sameSite: 'lax',
    path: '/', // Setting the path to '/' for global availability
  });
}

export async function updateSession() {
  const session = cookies().get('session')?.value
  const payload = await decrypt(session)
 
  if (!session || !payload) {
    return null
  }
 
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

// Function to verify the session cookie and redirect if invalid
export async function verifySession() {
  try {
    const cookieVal = cookies().get('session')?.value;
    const cookie = await decrypt(cookieVal);

    if (!cookie) {
      redirect('/'); // Redirects if the cookie is missing or invalid
    }

    return cookie?.userToken;
  } catch (error) {
    console.error('Error in verifySession:', error);
    redirect('/'); // Redirect to the home page on error
  }
}

// Function to delete the session cookie and redirect
export async function deleteSession() {
  cookies().delete('session'); // Deleting the cookie
}