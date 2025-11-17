const validate = (schema, property = 'query') => (req, res, next) => {
  if (!schema) return next();
  const { value, error } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request parameters',
      details: error.details.map((detail) => detail.message)
    });
  }

  req[property] = value;
  return next();
};

module.exports = validate;
