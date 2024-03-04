// Import statements for Firebase v9
import { 
  addDoc, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion,
  DocumentData,
} from 'firebase/firestore'; 
import  data  from '../auth/firebase'; 
const { db } = data

const FirestoreService = {
  addOrganization: async (userId: string, name: string, email: string): Promise<string | undefined>  => {
        try {
            const orgRef = await addDoc(collection(db, 'organizations'), {
                name,
                email,
                managers: [userId],
                boards: [],
                collectors: [],
            });
            await setDoc(doc(db, 'users', userId), {
                organizationID: orgRef.id,
                role: 'organization'
            }, { merge: true });
            return orgRef.id;
        } catch (e) {
            console.log(e)
         }
  },

  addClient: async (userId: string, name: string): Promise<void> => {
    await setDoc(doc(db, 'users', userId), {
      name,
      role: 'client',
      boards: []
    }, { merge: true });
  },

  getUser: async (userId: string): Promise<DocumentData | null> =>{
    const user = await getDoc(doc(db, 'users', userId));
    if (user.exists()) {
      return user.data();
    } else {
      console.log("No such user!");
      return null;
    }
  },

  addBoard: async (serialNumber: string, orgId: string, status: 'empty' | 'full' = 'empty'): Promise<string> => {
    const boardRef = await addDoc(collection(db, 'boards'), {
      serialNumber,
      orgId,
      lat: "",
      lng: "",
      status,
      location: null,
    });
  
    return boardRef.id;
  },

  getBoard: async (serialNumber: string): Promise<Boolean> => {
    const boardDoc = await getDoc(doc(db, 'boards', serialNumber));
    if (boardDoc.exists()) { 
      return true
    }
    return false
  },

  getOrg: async (userId: string, serialNumber: string) => { 
    //@ts-ignore
    const role = await this.getUserRole(userId);
    if (role === "organization") {
      const userDocRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userDocRef);
    }
  },

  assignBoardToClient: async (boardId: string, clientId: string): Promise<void> => {
    const boardDocRef = doc(db, 'boards', boardId);
    await updateDoc(boardDocRef, {
      clientID: clientId
    });
    const clientDocRef = doc(db, 'users', clientId);
    await updateDoc(clientDocRef, {
      boards: arrayUnion(boardId)
    });
  },

  setUserRole: async (userId: string, role: 'organization' | 'client' | 'collector'): Promise<void> => {
    await setDoc(doc(db, 'users', userId), {
      role
    }, { merge: true });
  },

  getUserRole: async (userId: string): Promise<string | null> => {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    console.log(docSnap);
    if (docSnap.exists()) {
      return docSnap.data().role;
    } else {
      console.log("No such user!");
      return null;
    }
  },
};

export default FirestoreService;
