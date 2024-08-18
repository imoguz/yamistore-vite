import { User } from 'firebase/auth'
import {
  signInWithGoogle,
  registerWithEmail,
  signInWithEmail,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  signOutUser,
} from './auth'

export const handleEmailRegister = async (values: {
  firstName: string
  lastName: string
  email: string
  password: string
}) => {
  try {
    const { email, password, firstName, lastName } = values
    const user = await registerWithEmail(email, password)
    if (user) {
      // After registering, add the displayName using update operation.
      const displayName = `${firstName} ${lastName}`
      await updateUserProfile(user, displayName, null)
      console.log('Email registration successful: ', user)
      return user
    } else {
      throw new Error('User registration failed')
    }
  } catch (error) {
    console.error('Email registration error: ', error)
    throw error
  }
}

export const handleGoogleSignIn = async () => {
  try {
    const user = await signInWithGoogle()
    console.log('Google sign-in successful: ', user)
    return user
  } catch (error) {
    console.error('Google sign-in error: ', error)
    throw error
  }
}

export const handleEmailSignIn = async (values: {
  email: string
  password: string
}) => {
  try {
    const user = await signInWithEmail(values.email, values.password)
    console.log('Email sign-in successful: ', user)
    return user
  } catch (error) {
    console.error('Email sign-in error: ', error)
    throw error
  }
}

export const handleUpdateUserProfile = async (
  user: User,
  displayName: string | null,
  photoURL: string | null
) => {
  try {
    await updateUserProfile(user, displayName, photoURL)
    console.log('User profile updated successfully')
  } catch (error) {
    console.error('Error updating user profile: ', error)
  }
}

export const handleUpdateUserEmail = async (user: User, newEmail: string) => {
  try {
    await updateUserEmail(user, newEmail)
    console.log('User email updated successfully')
  } catch (error) {
    console.error('Error updating user email: ', error)
  }
}

export const handleUpdateUserPassword = async (
  user: User,
  newPassword: string
) => {
  try {
    await updateUserPassword(user, newPassword)
    console.log('User password updated successfully')
  } catch (error) {
    console.error('Error updating user password: ', error)
  }
}

export const handleSignOutUser = async () => {
  try {
    await signOutUser()
    console.log('User signed out successfully')
  } catch (error) {
    console.error('Sign out error: ', error)
    throw error
  }
}
