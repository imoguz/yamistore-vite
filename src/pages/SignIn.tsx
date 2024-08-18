import React, { useState, useEffect } from 'react'
import { IoMdEye } from 'react-icons/io'
import { IoMdEyeOff } from 'react-icons/io'
import { MdErrorOutline } from 'react-icons/md'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { signInSchema } from '../helpers/validationSchemas'
import { signInWithGoogle, signInWithEmail } from '../firebase/auth'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
const SignIn = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isFieldFocused, setIsFieldFocused] = useState({
    email: false,
    password: false,
  })

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      navigate('/')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err?.message?.replace('Firebase:', '') ??
            'Sorry, sign-in failed. Please try again later.'
        )
      }
    }
  }

  return (
    <div className='mx-auto border rounded-md max-w-[450px] text-gray-700 py-8 px-4 sm:px-8 my-7 overflow-hidden'>
      <div className='flex items-center justify-center gap-2 h-14 cursor-pointer'>
        <h1 className='text-3xl text-gray-900'>Sign in</h1>
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
          email: '',
          password: '',
        }}
        validationSchema={signInSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await signInWithEmail(values.email, values.password)
            resetForm()
            navigate('/')
          } catch (err: unknown) {
            if (err instanceof Error) {
              setError(
                err?.message?.replace('Firebase:', '') ??
                  'Sorry, sign-in failed. Please try again later.'
              )
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ values, handleBlur, isSubmitting }) => (
          <Form>
            <div className='relative h-[72px] pt-3'>
              <Field
                id='email'
                name='email'
                type='email'
                className='border rounded hover:border-black w-full h-11 px-2 focus:outline-red-900'
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
            <div className='relative h-[72px] pt-3'>
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
                className='peer-hover:border-black border rounded hover:border-black w-full h-11 pl-2 pr-12 focus:outline-red-900'
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
            <button
              type='submit'
              disabled={isSubmitting}
              className={`text-sm font-semibold hover:bg-opacity-95 w-full h-9 rounded mt-5 transition-all ${
                isSubmitting
                  ? 'bg-gray-200 text-gray-600 shadow-sm'
                  : 'bg-blue-500 text-white shadow-md'
              }`}
            >
              SIGN IN
            </button>
          </Form>
        )}
      </Formik>
      <div className='flex justify-between mx-1 mt-5 text-sm  text-blue-500'>
        <Link to='/'>
          <span className='text-sm text-blue-500 hover:text-blue-600 underline'>
            Forgot password?
          </span>
        </Link>
        <div className='text-gray-800 '>
          Don&apos;t have an account?
          <Link to='/sign-up'>
            <span className='text-blue-500 hover:text-blue-600 ml-1 underline '>
              Sign Up
            </span>
          </Link>
        </div>
      </div>
      <div className='relative my-10 border-t'>
        <span className='absolute bg-white text-gray-500 px-5 -top-3.5 left-1/2 transform -translate-x-1/2'>
          or
        </span>
      </div>
      <button
        type='button'
        onClick={handleGoogleSignIn}
        className='flex justify-center items-center gap-2 border text-sm text-gray-600 font-semibold shadow-sm hover:bg-gray-50 w-full h-10 rounded transition-colors duration-200'
      >
        <img src='/images/google.png' alt='Google' width={24} height={24} />
        Sign In With Google
      </button>
    </div>
  )
}

export default SignIn
