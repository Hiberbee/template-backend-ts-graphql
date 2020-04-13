module.exports = {
  service: {
    name: 'hiberbee',
    endpoint: {
      url: 'http://localhost:4000/graphql',
      headers: {
        authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJyb2xlcyI6WyJST0xFX0FQUCJdLCJ1c2VybmFtZSI6ImhpYmVyYmVlIn0.Owbyn2mgOPR1kGFuoglo3VqdGufxDyhwkL1T3V9BxaH9jWTyoWGR6aFh3-H7syIjCZ6M0LlH5-qokS0RFPc8GQ',
      },
      skipSSLValidation: true,
    },
  },
};
