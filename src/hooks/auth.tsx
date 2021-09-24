import React, { 
    createContext,
    ReactNode,
    useContext,
    useState
} from 'react';
import * as AuthSession from 'expo-auth-session';

interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthorizationResponse {
    params: {
        access_token: string;
    };
    type: string;
}

interface IAuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps){
   const [user, setUser] = useState<User>({} as User);

   async function signInWithGoogle() {
        try {
            const CLIENT_ID = '148560928667-g8p4jbtp2f15h8ijkgajneianue72nro.apps.googleusercontent.com';
            const REDIRECT_URI = 'https://auth.expo.io/@matheustark/gofinances';
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

           const { params, type } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;
           
           if(type === 'success') {
               const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
               const userinfo = await response.json();

               setUser({
                   id: userinfo.id,
                   name: userinfo.given_name,
                   email: userinfo.email,
                   photo: userinfo.picture
               })
           }

        } catch (error) {
            throw new Error(error); 
        }
    }

    return(
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth };