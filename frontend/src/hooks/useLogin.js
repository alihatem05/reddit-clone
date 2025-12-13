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

            const text = await response.text().catch(() => null)
            let json = null
            const contentType = response.headers.get('content-type') || ''

            if (contentType.includes('application/json')) {
                try { json = JSON.parse(text) } catch (e) {
                    console.warn('Login: invalid JSON response', text)
                    throw new Error('Unexpected server response')
                }
            } else if (text && text.trim().startsWith('<')) {
                console.warn('Login: received HTML response', text.slice(0,200))
                throw new Error('Server returned non-JSON response (check backend)')
            } else if (text) {
                try { json = JSON.parse(text) } catch (e) {
                    throw new Error(text)
                }
            }

            if (!response.ok) {
                setError(json?.error || json?.message || (typeof json === 'string' ? json : 'Login failed'))
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
