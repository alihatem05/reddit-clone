import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useUpdateProfile = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useAuthContext()

    const updateProfile = async (userId, updates) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates)
            })

            const text = await response.text().catch(() => null)
            let json = null
            const contentType = response.headers.get('content-type') || ''

            if (contentType.includes('application/json')) {
                try { 
                    json = JSON.parse(text) 
                } catch (e) { 
                    console.warn('UpdateProfile: invalid JSON', text)
                    throw new Error('Unexpected server response')
                }
            } else if (text && text.trim().startsWith('<')) {
                console.warn('UpdateProfile: received HTML', text.slice(0,200))
                throw new Error('Server returned non-JSON response (check backend)')
            } else if (text) {
                try { 
                    json = JSON.parse(text) 
                } catch (e) { 
                    throw new Error(text) 
                }
            }

            if (!response.ok) {
                setIsLoading(false)
                setError(json?.error || json?.message || 'Profile update failed')
                return null
            }

            localStorage.setItem("user", JSON.stringify(json.user))
            dispatch({ type: 'UPDATE_USER', payload: json.user })
            setIsLoading(false)
            return json.user
        } catch (err) {
            setIsLoading(false)
            setError(err.message || 'Profile update failed')
            return null
        }
    }

    return { updateProfile, isLoading, error }
}
