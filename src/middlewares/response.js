function Success(keyname, data) {
	return {
		response_info: {
			is_success: true,
			desc: '성공'
		},
		[keyname]: data
	}
}

function CustomError(errMessage, msg, data) {
	return {
		response_info: {
			is_success: false,
			desc: errMessage,
		},
		[msg]: data
	}
}

module.exports = {
	Success,
	CustomError,
}