import React, { useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RxCross1 } from 'react-icons/rx'
import { IoMdEye } from 'react-icons/io'
import { IoMdEyeOff } from 'react-icons/io'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import { User } from 'firebase/auth'

interface ISettingsFormProps {
  user: User | null
  formField: IFormField
}
const SettingsForm: React.FC<ISettingsFormProps> = ({ user, formField }) => {
  const [edit, setEdit] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isFieldFocused, setIsFieldFocused] = useState(false)
  const [isPwdFieldFocused, setIsPwdFieldFocused] = useState({
    newPassword: false,
    confirmPassword: false,
  })

  // only signin with "email and password" user can edit email and password
  const isSignInEmail = Boolean(
    user?.providerData[0]?.providerId === 'password'
  )
  const isDisableField = ['currentPassword', 'email'].includes(
    formField.fieldName
  )

  const initialValues: { [key: string]: string } =
    formField.fieldName === 'currentPassword'
      ? { currentPassword: '', newPassword: '', confirmPassword: '' }
      : { [formField.fieldName]: formField.initialValue }

  const handleCancelClick = (
    resetForm: FormikHelpers<typeof initialValues>['resetForm']
  ) => {
    resetForm({ values: initialValues })
    setEdit(false)
  }

  const handleEditClick = () => {
    setEdit(true)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={formField.validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        formField.action({
          user,
          [formField.fieldName]: values[formField.fieldName],
        })
        await formField.action(values)
        const resetValues =
          formField.fieldName === 'currentPassword'
            ? { currentPassword: '', newPassword: '', confirmPassword: '' }
            : { [formField.fieldName]: values[formField.fieldName] ?? '' }
        resetForm({ values: resetValues })
        setEdit(false)
        setSubmitting(false)
      }}
    >
      {({ values, resetForm, handleBlur, isSubmitting }) => (
        <Form>
          <div className='relative h-[68px] pt-3'>
            <div
              className={`peer absolute h-[42px] overflow-hidden rounded-r flex items-center right-[1px] top-1/2 transform -translate-y-1/2`}
            >
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className={`${
                  edit && formField.fieldName === 'currentPassword'
                    ? 'block'
                    : 'hidden'
                } w-6 h-11 flex justify-center items-center border-l hover:bg-gray-200 active:bg-gray-100 transition-colors duration-300`}
              >
                {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
              </button>
              <button
                type='button'
                onClick={handleEditClick}
                className={`${
                  edit ? 'hidden' : 'block'
                } w-6 h-11 flex justify-center items-center border-l hover:bg-gray-200 active:bg-gray-100 transition-colors duration-300 ${
                  !isSignInEmail && isDisableField && 'hidden'
                }`}
              >
                <MdEdit className='text-green-700' />
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`${
                  edit ? 'block' : 'hidden'
                } w-6 h-11 flex justify-center items-center border-l hover:bg-gray-200 active:bg-gray-100 transition-colors duration-300`}
              >
                <FaSave className='text-sky-600' />
              </button>
              <button
                type='button'
                onClick={() => handleCancelClick(resetForm)}
                className={`${
                  edit ? 'block' : 'hidden'
                } w-6 h-11 flex justify-center items-center border-l hover:bg-gray-200 active:bg-gray-100 transition-colors duration-300`}
              >
                <RxCross1 className='text-red-500' />
              </button>
            </div>
            <Field
              id={formField.fieldName}
              name={formField.fieldName}
              disabled={!edit}
              type={
                edit &&
                formField.fieldName === 'currentPassword' &&
                showPassword
                  ? 'text'
                  : formField.type
              }
              className={`peer-hover:border-black border rounded hover:border-black w-full h-11 pl-2 outline-offset-[1px] focus:outline-red-900 ${
                edit && formField.fieldName === 'currentPassword'
                  ? 'pr-[85px]'
                  : edit
                  ? 'pr-14'
                  : 'pr-8'
              } `}
              onFocus={() => setIsFieldFocused(true)}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                setIsFieldFocused(false)
                handleBlur(e)
              }}
            />
            <label
              htmlFor={formField.fieldName}
              className={`absolute left-2 text-gray-700 cursor-text transition-all duration-300 ${
                isFieldFocused || values[formField.fieldName] !== ''
                  ? 'top-0.5 bg-white rounded px-1 text-xs'
                  : 'top-1/2 transform -translate-y-1/2 text-md'
              } `}
            >
              {formField.fieldName === 'currentPassword' && !edit
                ? 'Change Password'
                : formField.label}
            </label>
            <ErrorMessage
              name={formField.fieldName}
              component='div'
              className='text-xs text-red-500 pl-2'
            />
          </div>
          {formField.fieldName === 'currentPassword' && edit && (
            <>
              <div className='relative h-[68px] pt-3'>
                <Field
                  id='newPassword'
                  name='newPassword'
                  type={showPassword ? 'text' : 'password'}
                  className={`border rounded hover:border-black w-full h-11 px-2 outline-offset-[1px] focus:outline-red-900 `}
                  onFocus={() =>
                    setIsPwdFieldFocused({
                      ...isPwdFieldFocused,
                      newPassword: true,
                    })
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    setIsPwdFieldFocused({
                      ...isPwdFieldFocused,
                      newPassword: false,
                    })
                    handleBlur(e)
                  }}
                />
                <label
                  htmlFor='newPassword'
                  className={`absolute left-2 text-gray-700 cursor-text transition-all duration-300 ${
                    isPwdFieldFocused.newPassword || values.newPassword !== ''
                      ? 'top-0.5 bg-white rounded px-1 text-xs'
                      : 'top-1/2 transform -translate-y-1/2 text-md'
                  } `}
                >
                  New Password
                </label>
                <ErrorMessage
                  name='newPassword'
                  component='div'
                  className='text-xs text-red-500 pl-2'
                />
              </div>
              <div className='relative h-[68px] pt-3'>
                <Field
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showPassword ? 'text' : 'password'}
                  className={`border rounded hover:border-black w-full h-11 px-2 outline-offset-[1px] focus:outline-red-900 `}
                  onFocus={() =>
                    setIsPwdFieldFocused({
                      ...isPwdFieldFocused,
                      confirmPassword: true,
                    })
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    setIsPwdFieldFocused({
                      ...isPwdFieldFocused,
                      confirmPassword: false,
                    })
                    handleBlur(e)
                  }}
                />
                <label
                  htmlFor='confirmPassword'
                  className={`absolute left-2 text-gray-700 cursor-text transition-all duration-300 ${
                    isPwdFieldFocused.confirmPassword ||
                    values.confirmPassword !== ''
                      ? 'top-0.5 bg-white rounded px-1 text-xs'
                      : 'top-1/2 transform -translate-y-1/2 text-md'
                  } `}
                >
                  Confirm New Password
                </label>
                <ErrorMessage
                  name='confirmPassword'
                  component='div'
                  className='text-xs text-red-500 pl-2'
                />
              </div>
            </>
          )}
        </Form>
      )}
    </Formik>
  )
}

export default SettingsForm
