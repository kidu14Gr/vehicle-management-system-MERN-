import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (formData) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('http://localhost:4000/api/user/signup', {
      method: 'POST',
      body: formData
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      // // save the user to local storage
      // localStorage.setItem('Ruser', JSON.stringify(json))

      // // update the auth context
      // dispatch({ type: 'LOGIN', payload: json })
      setSuccess('Account created successfully!')
      // update loading state
      setIsLoading(false)

      
    }
  }

  return { signup, isLoading, error,success }
}