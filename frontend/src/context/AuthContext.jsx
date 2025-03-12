import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const googleProvider = new GoogleAuthProvider();

export const AuthProvide = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const registerUser = async (email, password) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    };

    const loginUser = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = async () => {
        return await signInWithPopup(auth, googleProvider);
    };

    const logout = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#8B5C3E",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout!",
        });

        if (result.isConfirmed) {
            await signOut(auth);
            Swal.fire({
                title: "Logged Out!",
                text: "You have been successfully logged out.",
                icon: "success",
                confirmButtonColor: "#8B5C3E",
                timer: 2000,
            });
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value = {
        currentUser,
        loading,
        registerUser,
        loginUser,
        signInWithGoogle,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
