import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setError(null)

        try {
            const response = await fetch(`/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })

            let json = null
            try {
                json = await response.json()
            } catch (e) {
                throw new Error('Unexpected server response')
            }

            if (!response.ok) {
                setError(json?.error || json?.message || 'Login failed')
                return
            }
            localStorage.setItem("user", JSON.stringify(json.user))
            dispatch({ type: 'LOGIN', payload: json.user })
            return json.user
        } catch (err) {
            setError(err.message || 'Login failed')
            return null
        }
    }

    return { login, error }
}
