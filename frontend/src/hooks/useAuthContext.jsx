import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuthContext = () => {
    const context = useContext(AuthContext)
    if(!context){
        throw Error('must be use in the provider')
    }
    return context
}