import { createContext } from "react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

type AuthContext = {
    isLoading: boolean;
    session: UserAPIResponse | null;
    save: (data: UserAPIResponse) => void
    remove: () => void
}

const LOCAL_STORAGE_KEY = "@blocoZero";

export const AuthContext = createContext({} as AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<UserAPIResponse | null>(null);

    function save(data: UserAPIResponse) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}:user`, JSON.stringify(data.user));
        localStorage.setItem(`${LOCAL_STORAGE_KEY}:id_user`, data.user.id_user.toString());
        api.defaults.headers.common['Authorization'] = `Bearer ${data.user.id_user}`;
        setSession(data);
    }

    function remove() {
        setSession(null);
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`);
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}:id_user`);
        window.location.assign("/");
    }

    function loadUser() {
        const userStorage = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`);
        const tokenStorage = localStorage.getItem(`${LOCAL_STORAGE_KEY}:id_user`);

        if (tokenStorage && userStorage) {
            api.defaults.headers.common["Authorization"] = `Bearer ${tokenStorage}`;
            
            setSession({
                user: JSON.parse(userStorage)
            });
        }
        setIsLoading(false);
    }

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ session, save, isLoading, remove }}>
            {children}
        </AuthContext.Provider>
    );
}