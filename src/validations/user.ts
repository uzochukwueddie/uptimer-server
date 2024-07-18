import { isEmail } from '@app/utils/utils';
import { object, string } from 'yup';

const loginUsername = string()
  .required('Username is required.')
  .test('is-email', 'Invalid email', (value: string) => {
    if (value) {
      return isEmail(value)
        ? string().email('This is invalid email.').isValidSync(value)
        : string()
            .min(4, 'Username should have at least 4 characters.')
            .max(20, 'Username should have at most 20 characters.')
            .matches(/^\w+$/, 'Should be alphanumeric.')
            .isValidSync(value);
    }
    return true;
  });
const username = string()
  .required('Username is required.')
  .min(4, 'Username should have at least 4 characters.')
  .max(20, 'Username should have at most 20 characters.')
  .matches(/^\w+$/, 'Should be alphanumeric.')
  .optional();
const email = string().required('Email is required.').email('This is invalid email.');
const password = string()
  .optional()
  .min(5, 'Password should have at least 5 characters.')
  .max(10, 'Password should have at most 10 characters.');
const googleId = string().optional();
const facebookId = string().optional();

// User Registeration Validation Schema
export const UserRegisterationRules = object().shape({
  username,
  password,
  email,
  googleId,
  facebookId
});

// User Authentication Validation Schema
export const UserLoginRules = object().shape({
  username: loginUsername,
  password,
  googleId,
  facebookId
});
