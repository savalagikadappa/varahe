const Joi = require('joi');
const config = require('../config');

const yearPattern = /^\d{4}(?:-\d{4})?$/;

const electionQuerySchema = Joi.object({
  year: Joi.string().pattern(yearPattern).optional(),
  state_name: Joi.string().min(2).max(120).optional(),
  party: Joi.string().min(2).max(120).optional(),
  sex: Joi.string()
    .valid('M', 'F', 'UNKNOWN')
    .insensitive()
    .optional(),
  constituency_name: Joi.string().min(2).max(120).optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(config.pagination.maxLimit).optional()
});

const yearRangeSchema = Joi.object({
  year: Joi.string().pattern(yearPattern).optional()
});

const candidateSearchSchema = Joi.object({
  q: Joi.string().min(2).max(120).required(),
  limit: Joi.number().integer().min(1).max(200).optional()
});

module.exports = {
  electionQuerySchema,
  yearRangeSchema,
  candidateSearchSchema
};
