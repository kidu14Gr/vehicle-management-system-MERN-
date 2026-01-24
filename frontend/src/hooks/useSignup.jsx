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
    setSuccess(null)

    const response = await fetch('http://localhost:4000/api/pendinguser', {
      method: 'POST',
      body: formData
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      setSuccess('Registration submitted successfully! Please wait for admin approval.')
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error,success }
}