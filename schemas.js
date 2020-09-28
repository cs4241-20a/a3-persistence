module.exports = function (cache) {
  const yup = require("yup");

  this.commentSchema = {
    schema: {
      body: {
        yupSchema: yup.object().shape({
          username: yup
            .string()
            .required()
            .min(1, "Name too short")
            .max(40, "Name too long"),
          title: yup
            .string()
            .required()
            .min(1, "Title too short")
            .max(150, "Title too long"),
          message: yup
            .string()
            .required()
            .max(1000, "Too many characters in message"),
          isSpoiler: yup.bool().required(),
          isBug: yup.bool().required(),
          isFluff: yup.bool().required(),
        }),
      },
    },
  };

  this.editSchema = {
    schema: {
      body: {
        yupSchema: yup.object().shape({
          id: yup.number().required().positive(),
          title: yup
            .string()
            .required()
            .min(1, "Title too short")
            .max(150, "Title too long"),
          message: yup
            .string()
            .required()
            .max(1000, "Too many characters in message"),
          isSpoiler: yup.bool().required(),
          isBug: yup.bool().required(),
          isFluff: yup.bool().required(),
        }),
      },
    },
  };

  this.deleteSchema = {
    schema: {
      body: {
        yupSchema: yup.object().shape({
          id: yup.number().required().positive(),
        }),
      },
    },
  };

  this.registerSchema = {
    schema: {
      body: {
        yupSchema: yup.object().shape({
          username: yup
            .string()
            .required()
            .min(1, "Name too short")
            .max(40, "Name too long"),
          password: yup
            .string()
            .required()
            .min(1, "Password too short")
            .max(100, "Password too long"),
        }),
      },
    },
  };
};
