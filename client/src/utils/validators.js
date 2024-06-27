import { isValidUsername } from "6pp";

export const userNameValidation = (value) => {
  if (!isValidUsername(value))
    return { isValid: false, errorMessage: "Please enter a valid username" };
};
