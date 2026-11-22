const NOM = 'token';

function poserCookie(res, token) {
  res.cookie(NOM, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 2 * 60 * 60 * 1000,
  });
}

function lireCookie(req) {
  return req.cookies ? req.cookies[NOM] : undefined;
}

function effacerCookie(res) {
  res.clearCookie(NOM);
}

module.exports = { poserCookie, lireCookie, effacerCookie };