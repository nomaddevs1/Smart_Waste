import { GeoPoint } from "firebase/firestore";

export interface Organization {
  name: string;
  email: string;
  managers: string[];
  boards: string[];
  collectors: string[];
}

export interface User {
  name?: string;
  role: 'organization' | 'client' | 'collector';
  organizationID?: string;
  boards?: string[];
}

export interface Board {
  UUID: string;
  orgId?: string;
  address: string;
  status: 'empty' | 'full';
  location?: GeoPoint | null; // Direct use of GeoPoint type from Firebase v9
  clientID?: string;
}


