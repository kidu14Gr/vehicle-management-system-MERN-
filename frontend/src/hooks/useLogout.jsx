import { useAuthContext } from './useAuthContext'
export const useLogout = () => {
    const {dispatch} = useAuthContext()

    const logout = () => {
        //remove user from staorage
        localStorage.removeItem('Ruser')
        //dispatch logout action
        dispatch({type: 'LOGOUT'})
    }
    return {logout}
}