const authServices = require("./auth.services");
const tokenServices = require("../token/token.services");
const userServices = require("../user/user.services");
const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const { sendResponse } = require("../../utils/responseHandler");

const adminLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.adminLoginUserWithEmailAndPassword(
    email,
    password
  );
  const tokens = await tokenServices.generateAuthTokens(user);
  sendResponse(res, httpStatus.OK, { user, tokens }, null);
});
function randomStringForUsername(length) {
	var result = '';
	var characters = '0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
  }
  
const processGoogleAuth = async (gUser) => {
  let user = null;
  user = await authServices.loginUserWithGoogleEmail(gUser.email);

  if (!user) {
    let userObj = {
      email: gUser.email,
      password: "Sample@123",
      fName: gUser.given_name,
      lName: gUser.family_name,
      role: "user",
      username: `${gUser.given_name}_${randomStringForUsername(4)}`,
      isEmailVerified: true,
      source: "google",
      createdAt: new Date(),
    };
    user = await userServices.createSocialUser(userObj);
    // signUpWelcomeEmail({ to: gUser.email, emailBody: { fName: gUser.given_name, lName: gUser.family_name, eMail: gUser.email } })
  }
  const tokens = await tokenServices.generateSocialLoginToken(user._id);
  return { socialLink: tokens.socialLink };
};


const socialLogin = catchAsync(async (req, res) => {
  const { token } = await pick(req.body, ["token"]);

  const { sub } = await tokenServices.justVerifyToken(token);
  let user = await userServices.getUserById(sub);
  user.id = user._id;

  let currentTimeStamp = new Date();
 
  utc =
    currentTimeStamp.getTime() + currentTimeStamp.getTimezoneOffset() * 60000;
  let singaporeTime = new Date(utc + 3600000 * "+8");
 
  let updateRes = await userServices.updateUserById(user.id, {
    currentLoginTimeStamp: singaporeTime,
  });
  if (updateRes) user = updateRes;

  const tokens = await tokenServices.generateAuthTokens(user);
  sendResponse(res, httpStatus.OK, { user, tokens }, null);
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authServices.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

module.exports = {
  adminLogin,
  refreshTokens,
  processGoogleAuth,
  socialLogin,
};
