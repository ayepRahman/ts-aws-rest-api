import * as yup from "yup";

const userSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email(),
  password: yup.string().required(),
});

const userValidation = async (data: any) => {
  await userSchema.validate(data);
};

export default userValidation;
