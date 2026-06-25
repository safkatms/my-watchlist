import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
        // Try popup first
        await signInWithPopup(auth, provider);
    } catch (error: any) {
        // If popup blocked, fall back to redirect
        if (error.code === 'auth/popup-blocked') {
            await signInWithRedirect(auth, provider);
        } else {
            throw error;
        }
    }
};

export const logout = () => signOut(auth);
export { auth };