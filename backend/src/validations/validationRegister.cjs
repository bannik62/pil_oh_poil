const Joi = require('joi');

const validationRegister = (data) => {
    console.log('data', data);

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$'))
            .message('Le mot de passe doit contenir au moins 8 caractères, un chiffre et un caractère spécial (!@#$%^&*).')
            .required(),
        // passwordConfirm: Joi.string().valid(Joi.ref('password')).required(),
        // firstName: Joi.string().min(1).required(),
        // lastName: Joi.string().min(1).required(),
    });

    return schema.validate(data);
};

module.exports = { validationRegister };