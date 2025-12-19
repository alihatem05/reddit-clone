import { createContext, useReducer } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload}
        case 'LOGOUT':
            return {user: null}
        case 'UPDATE_USER':
            return { user: action.payload }
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const stored = JSON.parse(localStorage.getItem('user')) || null
    const initialUser = stored && stored.user ? stored.user : stored
    const [state, dispatch] = useReducer(authReducer , {
        user: initialUser
    })
    console.log('AuthContext state: ', state)


    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}