const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const istokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;

  console.log("NODE_ENV:", process.env.NODE_ENV);
  

  const isProd = process.env.NODE_ENV === 'production'
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: isProd,
    signed: true,
    sameSite: isProd ? 'None' : 'Lax',
  });
  
};

module.exports = {
  createJWT,
  istokenValid,
  attachCookiesToResponse,
};
