import * as yup from "yup";

export const userSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[\d\s\-\+()]+$/, "Invalid phone number")
    .required("Phone number is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .positive()
    .integer()
    .nullable(),
  role: yup.string().required("Role is required"),

  address: yup.object().shape({
    address: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    country: yup.string().required("Country is required"),
  }),
});
