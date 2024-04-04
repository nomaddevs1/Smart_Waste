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
  runTransaction,
} from "firebase/firestore";
import data from "../auth/firebase";
import { BoardUpdateChanges } from "../types/types";
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
  addCollector: async (
    userId: string,
    name: string,
    orgId: string
  ): Promise<void> => {
    try {
      await setDoc(doc(db, "users", userId), {
        name,
        role: "collector",
        orgId: orgId,
        boardAssigned: [],
      });
    } catch (err) {
      console.log(err);
    }
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
    lat: string,
    lng: string,
    status: "empty" | "full" = "empty",
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
          lat: lat,
          lng: lng,
          status,
          clientId: "",
          location: null,
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
      throw e
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
    const que =
      user!.role === "organization" || "collector" ? "orgId" : "clientId";
    const id = user!.role === "organization" || "collector"? user!.orgId : userId;
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

  fetchAllBoards: async (userID?: string) => {
    try {
      const boardsRef = collection(db, "boards");
      const querySnapshot = await getDocs(boardsRef);
      const boards = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return boards;
    } catch (error) {
      console.error("Error fetching boards:", error);
      return []; // Return an empty array in case of an error
    }
  },

  updateBoard: async (
    boardId: string,
    userId: string,
    changes: BoardUpdateChanges
  ): Promise<Boolean | undefined> => {
    const user = await FirestoreService.getUser(userId);
    if (user && user.role === "collector") {
      const boardDocRef = doc(db, "boards", boardId);
      await updateDoc(boardDocRef, changes);
      return true;
    }
    return false; 
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


  getAllOrg: async (): Promise<DocumentData[] | []> => {
    const orgList: { id: string }[] = [];
    const querySnapshot = await getDocs(collection(db, "organizations"));
    querySnapshot.forEach((doc) => {
      orgList.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return orgList ? orgList : [];
  },


  assignBoardToClient: async (
    boardId: string,
    clientId: string
  ): Promise<void> => {
    try {
      await runTransaction(db, async (transaction) => {
        const boardRef = doc(db, "boards", boardId);
        const clientRef = doc(db, "users", clientId);

        const boardSnap = await transaction.get(boardRef);
        if (!boardSnap.exists()) throw new Error("Board does not exist");

        transaction.update(boardRef, { clientId });
        transaction.update(clientRef, { boards: arrayUnion(boardId) });
      });
    } catch (error: any) {
      console.error("Transaction failed:", error.message);
      throw new Error(error.message);
    }
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
