export default {
  fields: {
    Name: 'Name',
    ApiKey: 'API Key'
  },
  format: (field, message) => `${field}: ${message}`,
  string_eq: p => `length must be equal to ${p}`,
  string_gt: p => `length must be greater than ${p}`,
  string_gte: p => `length must be greater than or equal to ${p}`,
  string_lt: p => `length must be less than ${p}`,
  string_lte: p => `length must be less than or equal to ${p}`,
  string_ne: p => `length must not be ${p}`,
  string_uniqueness: p => `already exists`,
  string_required: p => `must not be blank`,
  string_wrong: p => `wrong name or password`,
  string_deleted: p => `user has been deleted`,
  string_duplicate: p => `duplicate content`,
}
