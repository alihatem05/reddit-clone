import { useNavigate } from 'react-router-dom'

export const useDisplayPost = () => {
    const navigate = useNavigate()

    if (!navigate) {
        throw Error('useDisplayPost must be used inside a Router')
    }

    const displayPost = (postId) => {
        console.log('Navigating to post', postId)
        navigate(`/post/${postId}`)
    }

    return displayPost
}

export default useDisplayPost
