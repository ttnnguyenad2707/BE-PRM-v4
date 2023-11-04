const Joi = require('joi');
const asyncHandler = require('../utils/async-handler');

module.exports = {
    validatePOST: asyncHandler(async (req, res, next) => {
        await Joi.object({
            firstname: Joi.string().allow(null, ''),
            lastname: Joi.string().allow(null, ''),
            email: Joi.string()
                .email()
                .not(null)
                .only()
                .required(),
            password: Joi.string()
                .min(8)
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')) // Mật khẩu phải chứa ít nhất một chữ cái thường, một chữ cái hoa và một số
                .required(),
        }).validateAsync(req.body, { abortEarly: false });

        next();
    }),
    validatePUT: asyncHandler(async (req, res, next) => {
        await Joi.object({
            firstname: Joi.string().allow(null, ''),
            lastname: Joi.string().allow(null, ''),
            email: Joi.string()
                .email()
                .not(null)
                .only()
                .required(),

            phone: Joi.number()
                .allow('', null)
                .min(10),
                avatar: Joi.string()
                .not(null)
                .only()
                .required(),
            // password: Joi.string()
            //     .min(8)
            //     .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')) // Mật khẩu phải chứa ít nhất một chữ cái thường, một chữ cái hoa và một số
            //     .required(),
        }).validateAsync(req.body, { abortEarly: false });

        next();
    }),
    validatePUTChangePassword: asyncHandler(async (req, res, next) => {
        try {
            await Joi.object({
                password: Joi.string()
                    .min(8)
                    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')) // Mật khẩu phải chứa ít nhất một chữ cái thường, một chữ cái hoa và một số
                    .required(),
                newPassword: Joi.string()
                    .min(8)
                    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')) // Mật khẩu phải chứa ít nhất một chữ cái thường, một chữ cái hoa và một số
                    .required(),
                confirmPassword: Joi.string()
                    .min(8)
                    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')) // Mật khẩu phải chứa ít nhất một chữ cái thường, một chữ cái hoa và một số
                    .required(),
            }).validateAsync(req.body, { abortEarly: false });

            next();
        } catch (error) {
            let errorMessage;

            if (error.details.length > 0) {
                const err = error.details.shift(); // Lấy thông báo lỗi đầu tiên thay vì map 1 mảng lỗi

                if (err.context.key === 'password' || err.context.key === 'newPassword' || err.context.key === 'confirmPassword') {
                    errorMessage = 'Mật khẩu phải lớn hơn 8 kí tự, chứa ít nhất một chữ cái thường, một chữ cái hoa và một số và không được để trống';
                }
            }

            res.status(400).json({ error: errorMessage });
        }
    }),
};
