// Import statements for Firebase v9
import {
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  setDoc,
  updateDoc,
  arrayUnion,
  DocumentData,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import data from "../auth/firebase";
const { db } = data;

const FirestoreService = {
  addOrganization: async (
    userId: string,
    name: string,
    email: string,
    orgName?: string
  ): Promise<string | undefined> => {
    try {
      const orgRef = await addDoc(collection(db, "organizations"), {
        orgName,
        email,
        managers: [userId],
        boards: [],
        collectors: [],
      });
      await setDoc(
        doc(db, "users", userId),
        {
          orgId: orgRef.id,
          name,
          role: "organization",
        },
        { merge: true }
      );
      return orgRef.id;
    } catch (e: any) {
      throw new Error(e);
    }
  },

  addClient: async (
    userId: string,
    name: string,
    email: string
  ): Promise<void> => {
    await setDoc(
      doc(db, "users", userId),
      {
        name,
        role: "client",
        email,
        boards: [],
      },
      { merge: true }
    );
  },

  getUser: async (userId: string): Promise<DocumentData | null> => {
    const user = await getDoc(doc(db, "users", userId));
    if (user.exists()) {
      return user.data();
    } else {
      throw new Error("No such user");
    }
  },

  addBoard: async (
    serialNumber: string,
    userId: string,
    status: "empty" | "full" = "empty"
  ): Promise<string> => {
    try {
      const boardDocRef = doc(db, "boards", serialNumber);
      const boardExits = await getDoc(boardDocRef);

      if (boardExits.data() !== undefined) {
        throw new Error("Board already exits");
      }
      const user = await FirestoreService.getUser(userId);
      if (user && user.role === "organization") {
        // Add a new board document
        await setDoc(boardDocRef, {
          serialNumber,
          orgId: user.orgId,
          lat: "",
          lng: "",
          status,
          clientId: "",
          location: null,
          name: null,
        });
        // Update the organization document to include the new board ID
        const orgRef = doc(db, "organizations", user.orgId);
        await updateDoc(orgRef, {
          boards: arrayUnion(serialNumber),
        });
        return serialNumber;
      } else {
        throw new Error("User must be an organization to add a board.");
      }
    } catch (e) {
      console.error("Failed to add board:", e);
      throw e; // Rethrow the error for handling elsewhere
    }
  },

  getBoard: async (
    serialNumber: string,
    userId: string
  ): Promise<DocumentData | null> => {
    const user = await FirestoreService.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "organization") {
      const boardDoc = await getDoc(doc(db, "boards", serialNumber));
      if (boardDoc.exists()) {
        return boardDoc.data();
      }
    }
    return null;
  },

  getAllBoardsForOrg: async (userId: string): Promise<DocumentData[] | []> => {
    try {
      const user = await FirestoreService.getUser(userId);
      const que = user!.role === "organization" ? "orgId" : "clientId";
      const id = user!.role === "organization" ? user!.orgId : userId;
      const boardsRef = collection(db, "boards");
      const q = query(boardsRef, where(que, "==", id)); // Adjust "orgId" to "userId" if needed

      const querySnapshot = await getDocs(q);
      const boards = querySnapshot.docs.map((doc) => doc.data());
      return boards;
    } catch (error) {
      console.error("Failed to fetch boards:", error);
      return [];
    }
  },

  listenForBoardUpdates: async (
    userId: string,
    onUpdate: (boards: DocumentData[]) => void
  ) => {
    const user = await FirestoreService.getUser(userId);
   
      const que = user!.role === "organization" ? "orgId" : "clientId";
      const id = user!.role === "organization" ? user!.orgId : userId;
      const boardsRef = collection(db, "boards");
      let q = query(boardsRef, where(que, "==", id));
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const boardsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          onUpdate(boardsData);
        },
        (error) => {
          console.error("Error listening to boards updates:", error);
        }
        );
        return unsubscribe;
       
  },

  setBoardStatus : async (serialNumber: string): Promise<void> => {
    try {
      const boardRef = doc(db, "boards", serialNumber);
      const querySnapshot = await getDoc(boardRef);

      if (!querySnapshot.exists()){
        throw new Error("Board does not exist");
      }

      await updateDoc(boardRef, {
        status: "empty"
      });

    } catch (error) {
      console.error("Error updating status: ", error);
    }
  },

  setBoardLocation : async (serialNumber: string, newLocation: string): Promise<void> => {
    try {
      const boardRef = doc(db, "boards", serialNumber);
      const querySnapshot = await getDoc(boardRef);

      if (!querySnapshot.exists()){
        throw new Error("Board does not exist");
      }

      await updateDoc(boardRef, {
        location: newLocation
      });

    } catch (error) {
      console.error("Error updating location: ", error);
    }
  },

  setBoardName : async (serialNumber: string, newName: string): Promise<void> => {
    try {
      const boardRef = doc(db, "boards", serialNumber);
      const querySnapshot = await getDoc(boardRef);

      if (!querySnapshot.exists()){
        throw new Error("Board does not exist");
      }

      await updateDoc(boardRef, {
        name: newName
      });

    } catch (error) {
      console.error("Error updating location: ", error);
    }
  },

  fetchAllBoards : async ()=>  {
    try {
      const boardsRef = collection(db, "boards");
      const querySnapshot = await getDocs(boardsRef);
      const boards = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return boards;
    } catch (error) {
      console.error("Error fetching boards:", error);
      return []; // Return an empty array in case of an error
    }
  },
  

  getOrg: async (
    userId: string,
    serialNumber: string
  ): Promise<DocumentData | undefined> => {
    const user = await FirestoreService.getUser(userId);
    if (user!.role === "organization") {
      const userDocRef = doc(db, "organization", user!.orgId);
      const docSnap = await getDoc(userDocRef);
      return docSnap.data();
    }
  },

  getAllOrg: async (): Promise<DocumentData | undefined> => {
    const orgList: {id: string, data: any}[] = [];
    const querySnapshot = await getDocs(collection(db, "organizations"));
    querySnapshot.forEach((doc) => {
      orgList.push({
        id: doc.id,
        data: doc.data()
      });
    });

    return orgList
  },

  assignBoardToClient: async (
    boardId: string,
    clientId: string
  ): Promise<void> => {
    const boardDocRef = doc(db, "boards", boardId);
    await updateDoc(boardDocRef, {
      clientID: clientId,
    });
    const clientDocRef = doc(db, "users", clientId);
    await updateDoc(clientDocRef, {
      boards: arrayUnion(boardId),
    });
  },

  setUserRole: async (
    userId: string,
    role: "organization" | "client" | "collector"
  ): Promise<void> => {
    await setDoc(
      doc(db, "users", userId),
      {
        role,
      },
      { merge: true }
    );
  },

  getUserRole: async (userId: string): Promise<string | null> => {
    try {
      const userDocRef = doc(db, "users", userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return docSnap.data().role;
      } else {
        return null;
      }
    } catch (e: any) {
      throw new Error(e.message);
    }
  },
};

export default FirestoreService;
