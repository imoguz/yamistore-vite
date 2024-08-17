import { object, string, ref } from 'yup'

const passwordValidation = string()
  .required()
  .matches(/\d+/, 'Password must contain at least one digit')
  .matches(/[a-z]/, 'Password must contain at least one lowercase')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase')
  .matches(
    /[!,?{}><%&$#£+-.@]+/,
    'Password must contain at least one special character'
  )
  .min(8, 'Password must be min 8 characters')
  .max(32, 'Password must be max 32 characters')

export const signInSchema = object({
  email: string().email().required(),
  password: passwordValidation,
})

export const signUpSchema = object({
  firstName: string().required().label('first name'),
  lastName: string().required().label('last name'),
  email: string().email().required(),
  password: passwordValidation,
  confirmPassword: passwordValidation
    .oneOf([ref('password'), ''], 'Passwords must match')
    .label('confirm password'),
})

const displayName = object({
  displayName: string().required(),
})
const photoURL = object({
  photoURL: string().url().label('profile picture'),
})
const email = object({
  email: string().email().required(),
})
const currentPassword = object({
  currentPassword: passwordValidation.required(),
  newPassword: passwordValidation.required(),
  confirmPassword: passwordValidation
    .required()
    .oneOf([ref('newPassword'), ''], 'Passwords must match')
    .label('confirm password'),
})

export const settingsSchema = { displayName, photoURL, email, currentPassword }
