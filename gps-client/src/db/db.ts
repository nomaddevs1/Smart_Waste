// Import statements for Firebase v9
import { 
  addDoc, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion,
} from 'firebase/firestore'; 
import  data  from '../auth/firebase'; // Ensure db is initialized using Firebase v9


const {db} = data

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
            console.log(orgRef)
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

  addBoard: async (serialNumber: string, orgId: string, address: string, status: 'empty' | 'full' = 'empty'): Promise<string> => {
    const boardRef = await addDoc(collection(db, 'boards'), {
      serialNumber,
      orgId,
      address,
      status,
      location: null,
    });
    if (orgId) {
      const orgDocRef = doc(db, 'organizations', orgId);
      await updateDoc(orgDocRef, {
        boards: arrayUnion(boardRef.id)
      });
    }
    return boardRef.id;
  },
  getOrg: async (userId: string, serialNumber: string) => { 
    //@ts-ignore
    const role = await this.getUserRole(userId);
    console.log(role)
    if (role === "organization") {
      const userDocRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userDocRef);
      console.log(docSnap)
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
    if (docSnap.exists()) {
      return docSnap.data().role;
    } else {
      console.log("No such user!");
      return null;
    }
  },
};

export default FirestoreService;
