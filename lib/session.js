import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'prodwm_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 jam
  },
};

export async function getSession() {
  const session = await getIronSession(await cookies(), sessionOptions);
  return session;
}