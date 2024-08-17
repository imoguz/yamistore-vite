import React, { useState, useEffect } from 'react'
import { IoMdEye } from 'react-icons/io'
import { IoMdEyeOff } from 'react-icons/io'
import { MdErrorOutline } from 'react-icons/md'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { signUpSchema } from '../helpers/validationSchemas'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  signInWithGoogle,
  registerWithEmail,
  updateUserProfile,
} from '../firebase/auth'

const SignUp = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isFieldFocused, setIsFieldFocused] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 15000)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const handleEmailRegister = async (values: ISignUpValues, resetForm: any) => {
    try {
      const { firstName, lastName, email, password } = values
      const user = await registerWithEmail(email, password)
      if (user) {
        const displayName = `${firstName} ${lastName}`
        await updateUserProfile(user, displayName, null)
      }
      resetForm()
      navigate('/')
    } catch (err: any) {
      setError(
        err?.message?.replace('Firebase:', '') ??
          'Sorry, registration failed. Please try again later.'
      )
    }
  }
  return (
    <div className='mx-auto border rounded-md max-w-[450px] text-gray-700 py-8 px-4 sm:px-8 my-7 overflow-hidden'>
      <div className='flex items-center justify-center gap-2 h-14 cursor-pointer'>
        <h1 className='text-3xl text-gray-900'>Sign up</h1>
        <img
          src='/images/yamilogo.jpg'
          alt='Firm Logo'
          width={140}
          height={60}
        />
      </div>
      <div
        className={`relative flex items-center justify-center px-2 min-h-10 w-full text-[13px] text-gray-50 rounded-sm transition-all duration-300
          ${error ? 'left-0 bg-red-500' : '-left-[450px] bg-transparent'} `}
      >
        <span>
          <MdErrorOutline className='inline size-4 mb-0.5 mr-1' />
          {error}
        </span>
      </div>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={signUpSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          handleEmailRegister(values, resetForm)
          setSubmitting(false)
        }}
      >
        {({ values, handleBlur, isSubmitting }) => (
          <Form>
            <div className='flex flex-col xs:flex-row gap-1'>
              <div className='relative h-[68px] pt-3 w-full xs:w-1/2'>
                <Field
                  id='firstName'
                  name='firstName'
                  type='text'
                  className='border rounded hover:border-black w-full h-11 px-2 focus:outline-blue-500'
                  onFocus={() =>
                    setIsFieldFocused({ ...isFieldFocused, firstName: true })
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    setIsFieldFocused({ ...isFieldFocused, firstName: false })
                    handleBlur(e)
                  }}
                />
                <label
                  htmlFor='firstName'
                  className={`absolute left-2 text-gray-700 cursor-text transition-all duration-300 ${
                    isFieldFocused.firstName || values.firstName !== ''
                      ? 'top-0.5 bg-white rounded px-1 text-xs'
                      : 'top-1/2 transform -translate-y-1/2 text-md'
                  } `}
                >
                  First Name
                </label>
                <ErrorMessage
                  name='firstName'
                  component='div'
                  className='text-xs text-red-500 pl-2'
                />
              </div>
              <div className='relative h-[68px] pt-3 w-full xs:w-1/2'>
                <Field
                  id='lastName'
                  name='lastName'
                  type='text'
                  className='border rounded hover:border-black w-full h-11 px-2 focus:outline-sky-500'
                  onFocus={() =>
                    setIsFieldFocused({ ...isFieldFocused, lastName: true })
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    setIsFieldFocused({ ...isFieldFocused, lastName: false })
                    handleBlur(e)
                  }}
                />
                <label
                  htmlFor='lastName'
                  className={`absolute left-2 text-gray-700 cursor-text transition-all duration-300 ${
                    isFieldFocused.lastName || values.lastName !== ''
                      ? 'top-0.5 bg-white rounded px-1 text-xs'
                      : 'top-1/2 transform -translate-y-1/2 text-md'
                  } `}
                >
                  Last Name
                </label>
                <ErrorMessage
                  name='lastName'
                  component='div'
                  className='text-xs text-red-500 pl-2'
                />
              </div>
            </div>
            <div className='relative h-[68px] pt-3'>
              <Field
                id='email'
                name='email'
                type='email'
                className='border rounded hover:border-black w-full h-11 px-2 focus:outline-sky-500'
                onFocus={() =>
                  setIsFieldFocused({ ...isFieldFocused, email: true })
                }
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  setIsFieldFocused({ ...isFieldFocused, email: false })
                  handleBlur(e)
                }}
              />
              <label
                htmlFor='email'
                className={`absolute left-2 text-gray-700 cursor-text transition-all duration-300 ${
                  isFieldFocused.email || values.email !== ''
                    ? 'top-0.5 bg-white rounded px-1 text-xs'
                    : 'top-1/2 transform -translate-y-1/2 text-md'
                } `}
              >
                Email Address
              </label>
              <ErrorMessage
                name='email'
                component='div'
                className='text-xs text-red-500 pl-2'
              />
            </div>
            <div className='relative h-[68px] pt-3'>
              <div
                className='peer absolute text-xl right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full cursor-pointer hover:bg-gray-200'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
              </div>
              <Field
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                className='peer-hover:border-black border rounded hover:border-black w-full h-11 pl-2 pr-12 focus:outline-sky-500'
                onFocus={() =>
                  setIsFieldFocused({ ...isFieldFocused, password: true })
                }
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  setIsFieldFocused({ ...isFieldFocused, password: false })
                  handleBlur(e)
                }}
              />
              <label
                htmlFor='password'
                className={`absolute left-2 text-gray-700 cursor-text transition-all duration-300 ${
                  isFieldFocused.password || values.password !== ''
                    ? 'top-0.5 bg-white rounded px-1 text-xs'
                    : 'top-1/2 transform -translate-y-1/2 text-md'
                } `}
              >
                Password
              </label>
              <ErrorMessage
                name='password'
                component='div'
                className='text-xs text-red-500 pl-2'
              />
            </div>
            <div className='relative h-[68px] pt-3'>
              <div
                className='peer absolute text-xl right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full cursor-pointer hover:bg-gray-200'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
              </div>
              <Field
                id='confirmPassword'
                name='confirmPassword'
                type={showPassword ? 'text' : 'password'}
                className='peer-hover:border-black border rounded hover:border-black w-full h-11 pl-2 pr-12 focus:outline-sky-500'
                onFocus={() =>
                  setIsFieldFocused({
                    ...isFieldFocused,
                    confirmPassword: true,
                  })
                }
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  setIsFieldFocused({
                    ...isFieldFocused,
                    confirmPassword: false,
                  })
                  handleBlur(e)
                }}
              />
              <label
                htmlFor='confirmPassword'
                className={`absolute left-2 text-gray-700 cursor-text transition-all duration-300 ${
                  isFieldFocused.confirmPassword ||
                  values.confirmPassword !== ''
                    ? 'top-0.5 bg-white rounded px-1 text-xs'
                    : 'top-1/2 transform -translate-y-1/2 text-md'
                } `}
              >
                Confirm Password
              </label>
              <ErrorMessage
                name='confirmPassword'
                component='div'
                className='text-xs text-red-500 pl-2'
              />
            </div>
            <button
              type='submit'
              disabled={isSubmitting}
              className={`text-sm font-semibold hover:bg-opacity-95 w-full h-9 rounded mt-5 transition-all ${
                isSubmitting
                  ? 'bg-gray-200 text-gray-600 shadow-sm'
                  : 'bg-blue-500 text-white shadow-md'
              }`}
            >
              SIGN UP
            </button>
          </Form>
        )}
      </Formik>
      <div className='text-center mt-4 text-sm text-gray-800'>
        Already have an account?
        <Link to='/sign-in'>
          <span className='text-blue-500 hover:text-blue-600 ml-1 underline'>
            Sign In
          </span>
        </Link>
      </div>
      <div className='relative my-6 border-t'>
        <span className='absolute bg-white text-gray-500 px-5 -top-3.5 left-1/2 transform -translate-x-1/2'>
          or
        </span>
      </div>
      <button
        type='button'
        onClick={signInWithGoogle}
        className='flex justify-center items-center gap-2 border text-sm text-gray-600 font-semibold shadow-sm hover:bg-gray-50 w-full h-10 rounded transition-colors duration-200'
      >
        <img src='/images/google.png' alt='Google' width={24} height={24} />
        Sign Up With Google
      </button>
      <div className='text-xs text-center mt-5'>
        By signing up, you agree to the
        <Link to='/'>
          <span className='text-blue-400 hover:text-blue-500 font-semibold mx-1'>
            Terms & Conditions
          </span>
        </Link>
        &
        <Link to='/'>
          <span className='text-blue-400 hover:text-blue-500 font-semibold ml-1'>
            Privacy Policy
          </span>
        </Link>
        .
      </div>
    </div>
  )
}

export default SignUp
