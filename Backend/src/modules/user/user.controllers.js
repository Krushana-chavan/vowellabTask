const httpStatus = require('http-status');
const catchAsync = require("../../utils/catchAsync");
const pick = require('../../utils/pick');
const { sendResponse } = require("../../utils/responseHandler");
const userServices = require("./user.services");
const tokenServices = require("../token/token.services");
const { convertToJSON } = require('../../utils/helper');
const { tokenTypes } = require('../../config/tokens');




const signupUser = catchAsync(async (req, res) => {
	let user = req.body;
	let duplicateUsername = await userServices.isUsernameTaken(user?.username);
	if (duplicateUsername) {
		sendResponse(res, httpStatus.BAD_REQUEST, null, `This username already taken, please use different username.`);
		return
	}
	let duplicateEmail = await userServices.isEmailTaken(user?.email);
	if (duplicateEmail) {
		sendResponse(res, httpStatus.BAD_REQUEST, null, `This email already registered with us, please use different email.`);
		return
	}

	if (user) {
		let addResponse = await userServices.signupUser(user)
		if (addResponse) {

			const tokens = await tokenServices.generateAuthTokens(addResponse);

			return sendResponse(res, httpStatus.OK, { user: addResponse, tokens }, null);
		}
	} else {
		return sendResponse(res, httpStatus.BAD_REQUEST, null, `User not added`);

	}
});


const newUser = catchAsync(async (req, res) => {
	let user = req.body;
	
	let duplicateEmail = await userServices.isEmailTaken(user?.email);
	if (duplicateEmail) {
		sendResponse(res, httpStatus.BAD_REQUEST, null, `This email already registered with us, please use different email.`);
		return
	}

	if (user) {
		let addResponse = await userServices.newUser(user)
		if (addResponse) {

			const tokens = await tokenServices.generateAuthTokens(addResponse);

			return sendResponse(res, httpStatus.OK, { user: addResponse, tokens }, null);
		}
	} else {
		return sendResponse(res, httpStatus.BAD_REQUEST, null, `User not added`);

	}
});

const login = catchAsync(async (req, res) => {
	const { email = "", username = "", password } = await pick(req.body, ["email", "username", "password"]);
	let user = null;
	if (email) {
		user = await userServices.isEmailTaken(email);
	} else if (username) {
		user = await userServices.isUsernameTaken(username);
	}
	if (user) {
		let checkPasswordMatch = await userServices.isPasswordMatch(password, user)
		if (checkPasswordMatch) {
			const tokens = await tokenServices.generateAuthTokens(user);
			sendResponse(res, httpStatus.OK, { user, tokens }, null);
			return
		} else {
			sendResponse(res, httpStatus.UNAUTHORIZED, "Incorrect Password", null);
			return
		}
	} else {
		sendResponse(res, httpStatus.NOT_FOUND, null, "User not found, please signup to login.");
		return
	}
});

const getCurrentUser = catchAsync(async (req, res) => {
	const user = req.user;
	if (user) {
		sendResponse(res, httpStatus.OK, user, null)
		return
	} else {
		sendResponse(res, httpStatus.BAD_REQUEST, null, "Something wen wrong!");
		return
	}
	
});

const updateMyAccount = catchAsync(async (req, res) => {
	let userbody = req.body;
	let user = req.user;

	if (user) {
		let addResponse = await userServices.updateMyAccount({
			userId: user?.id,
			userbody,
		});
		if (addResponse.status) {
			return sendResponse(res, httpStatus.OK, addResponse.data, null);
		}
	} else {
		return sendResponse(
			res,
			httpStatus.BAD_REQUEST,
			null,
			addResponse?.msg
		);
	}
});


const admingetUsers = catchAsync(async (req, res) => {
	const { page, limit, filter, sort } = req.query;

	let filter_Json_data = filter ? convertToJSON(filter.query) : undefined;
	let result = await userServices.admingetUsersServices(page, limit, filter_Json_data, sort);
	if (result.status) {
		sendResponse(res, httpStatus.OK, {
			data: result?.data,
			totalResults: result?.totalResults,
			totalPages: result?.totalPages,
			page: result?.page,
			limit: result?.limit
		}, null);
	} else {
		if (result?.code === 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data);
		} else if (result?.code === 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result?.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result);
		}
	}
});


const resetPassword = catchAsync(async (req, res) => {
	const { newPassword, previousPassoword } = await pick(req.body, ["newPassword", "previousPassoword"]);
	try {

		if (token) {
			const updateResult = await userServices.resetPassword(newPassword, previousPassoword);

			if (updateResult.status) {
				sendResponse(res, httpStatus.OK, { message: 'Password reset successfully' }, null);
			} else if (updateResult.code === 400) {
				sendResponse(res, httpStatus.BAD_REQUEST, { message: 'Reset Password link expired or invalid !! ' }, "Reset Password link expired or invalid !!");

			} else {
				sendResponse(res, httpStatus.BAD_REQUEST, null, 'Password reset failed');
			}
		} else {
			sendResponse(res, httpStatus.UNAUTHORIZED, null, 'Invalid or expired reset password token');
		}
	} catch (error) {
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'An error occurred: ' + error.message);
	}
});

const generateResetPasswordToken = catchAsync(async (req, res) => {
	const { email } = await pick(req.body, ["email"]);
	try {
		const resetPasswordToken = await userServices.generateResetPasswordToken(email);

		if (resetPasswordToken) {
			resetPasswordMail({ to: email, emailBody: resetPasswordToken.resetPasswordToken })
			sendResponse(res, httpStatus.OK, resetPasswordToken, null);

		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, 'User not found or Failed to generate reset password token');
		}
	} catch (error) {
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'An error occurred: ' + error.message);
	}
});

const verifyToken = catchAsync(async (req, res) => {
	const { id } = await pick(req.params, ["id"]);
	try {
		const result = await userServices.verifyToken(id);
		if (result.status) {
			sendResponse(res, httpStatus.OK, null, 'Email verified !!');
		}else if(result.code === 400){
			sendResponse( res, httpStatus.BAD_REQUEST, null,'Reset Password link expired !!' );
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, 'Failed to generate reset password token');
		}

	} catch (error) {
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'An error occurred: ' + error);
	}

})


module.exports = {
	signupUser,
	login,
	getCurrentUser,
	updateMyAccount,
	admingetUsers,
	resetPassword,
	generateResetPasswordToken,
	verifyToken,
	newUser,
}