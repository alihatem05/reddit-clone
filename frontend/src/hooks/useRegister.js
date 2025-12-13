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

            const text = await response.text().catch(() => null)
            let json = null
            const contentType = response.headers.get('content-type') || ''

            if (contentType.includes('application/json')) {
                try { json = JSON.parse(text) } catch (e) { console.warn('Register: invalid JSON', text); throw new Error('Unexpected server response'); }
            } else if (text && text.trim().startsWith('<')) {
                console.warn('Register: received HTML', text.slice(0,200));
                throw new Error('Server returned non-JSON response (check backend)')
            } else if (text) {
                try { json = JSON.parse(text) } catch (e) { throw new Error(text) }
            }

            if (!response.ok) {
                setIsLoading(false)
                setError(json?.error || json?.message || (typeof json === 'string' ? json : 'Registration failed'))
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