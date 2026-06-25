import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithRedirect(auth, provider);
export const logout = () => signOut(auth);
export { auth };