import { db } from './firebase';
import {
    doc, setDoc, deleteDoc,
    collection, getDocs, updateDoc
} from 'firebase/firestore';
import type { WatchlistEntry, WatchStatus } from '../types';

const col = (uid: string) =>
    collection(db, 'users', uid, 'watchlist');

export async function addToWatchlist(uid: string, entry: WatchlistEntry) {
    await setDoc(doc(col(uid), entry.imdbID), entry);
}

export async function removeFromWatchlist(uid: string, imdbID: string) {
    await deleteDoc(doc(col(uid), imdbID));
}

export async function updateStatus(uid: string, imdbID: string, status: WatchStatus) {
    await updateDoc(doc(col(uid), imdbID), { status });
}

export async function updateRating(uid: string, imdbID: string, myRating: number) {
    await updateDoc(doc(col(uid), imdbID), { myRating });
}

export async function updateNotes(uid: string, imdbID: string, myNotes: string) {
    await updateDoc(doc(col(uid), imdbID), { myNotes });
}

export async function getWatchlist(uid: string): Promise<WatchlistEntry[]> {
    const snap = await getDocs(col(uid));
    return snap.docs.map(d => d.data() as WatchlistEntry);
}