import { useEffect, useState } from 'react'
import SettingsForm from '../components/settings/SettingsForm'
import { useUser } from '../contexts/UserContext'
import { MdErrorOutline } from 'react-icons/md'
import { settingsSchema } from '../helpers/validationSchemas'
import { handleUpdateUserProfile } from '../firebase/utils'

const Settings = () => {
  const { user } = useUser()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const formFields: IFormField[] = [
    {
      fieldName: 'displayName',
      label: 'Full Name',
      type: 'text',
      initialValue: user?.displayName ?? '',
      validationSchema: settingsSchema.displayName,
      action: handleUpdateUserProfile,
    },
    {
      fieldName: 'photoURL',
      label: 'Profile Picture',
      type: 'text',
      initialValue: user?.photoURL ?? '',
      validationSchema: settingsSchema.photoURL,
      action: handleUpdateUserProfile,
    },
    {
      fieldName: 'email',
      label: 'Email Address',
      type: 'email',
      initialValue: user?.email ?? '',
      validationSchema: settingsSchema.email,
      action: handleUpdateUserProfile,
    },
    {
      fieldName: 'currentPassword',
      label: 'Current Password',
      type: 'password',
      initialValue: '',
      validationSchema: settingsSchema.currentPassword,
      action: handleUpdateUserProfile,
    },
  ]

  return (
    <div className='mx-auto border rounded-md max-w-[450px] text-gray-700 py-5 px-4 sm:px-8 my-7 overflow-hidden'>
      <div className='text-center text-xl font-semibold'>Account Settings</div>
      <div className='flex text-center justify-center items-center mx-auto mt-7 mb-10 ring-2 ring-offset-1 ring-blue-300 rounded-full w-24 h-24 bg-orange-600'>
        {user && user?.photoURL ? (
          <img
            src={user?.photoURL}
            alt='Profile Photo'
            width={140}
            height={60}
            className='rounded-full w-full h-full object-cover'
          />
        ) : (
          <span className='text-[48px] font-semibold text-white'>
            {user?.displayName && user?.displayName.charAt(0).toUpperCase()}
          </span>
        )}
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
      {formFields.map((formField) => (
        <SettingsForm key={formField.fieldName} {...{ user, formField }} />
      ))}
    </div>
  )
}

export default Settings
