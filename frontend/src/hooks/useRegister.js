import { useState } from 'react'
import {useAuthContext} from './useAuthContext'

export const useRegister = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useAuthContext()

    const register = async (username, email, password) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/users/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, email, password})
            })

            let json = null
            try { json = await response.json() } catch (e) { throw new Error('Unexpected server response') }

            if (!response.ok) {
                setIsLoading(false)
                setError(json?.error || json?.message || 'Registration failed')
                return null
            }

            localStorage.setItem("user", JSON.stringify(json.user))
            dispatch({type: 'LOGIN', payload: json.user})
            setIsLoading(false)
            return json.user
        } catch (err) {
            setIsLoading(false)
            setError(err.message || 'Registration failed')
            return null
        }
    }

    return { register, isLoading, error }
}