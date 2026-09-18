import { USE_MOCK_DATA } from "./firebase";
import {
  usersStore,
  setUsers,
  storage,
  LOCAL_KEYS,
} from "./dataStore";
import { ROLES } from "../utils/constants";

const DEMO_CREDENTIALS = [
  { email: "staff@medwaste.demo", password: "staff123", role: ROLES.STAFF },
  { email: "collector@medwaste.demo", password: "collector123", role: ROLES.COLLECTOR },
  { email: "admin@medwaste.demo", password: "admin123", role: ROLES.ADMIN },
];

// Returns a promise to mirror a real async auth API.
export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const valid = DEMO_CREDENTIALS.some(
        (c) => c.email === email && c.password === password
      );
      if (!valid) {
        reject(new Error("Invalid email or password."));
        return;
      }
      const user = usersStore.findByEmail(email);
      if (!user) {
        reject(new Error("Account not found."));
        return;
      }
      const session = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
        },
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
      };
      storage.set(LOCAL_KEYS.auth, session);
      resolve(session.user);
    }, 600);
  });
};

export const getCurrentUser = () => {
  const session = storage.get(LOCAL_KEYS.auth, null);
  if (!session) return null;
  if (session.expiresAt && Date.now() > session.expiresAt) {
    storage.remove(LOCAL_KEYS.auth);
    return null;
  }
  return session.user || null;
};

export const logout = async () => {
  storage.remove(LOCAL_KEYS.auth);
  return Promise.resolve();
};

// When false, real Firebase auth would be used here.
export const loginWithProvider = async (_provider) => {
  if (!USE_MOCK_DATA) {
    // real implementation would use signInWithPopup
  }
  throw new Error("Provider login not configured.");
};

export const changePassword = async () => {
  // Hook for future Firebase implementation.
  throw new Error("Password change not available in demo mode.");
};

export const updateUserProfile = async (userId, patch) => {
  if (USE_MOCK_DATA) {
    const users = usersStore.all();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return null;
    const updated = { ...users[idx], ...patch };
    users[idx] = updated;
    setUsers(users);
    return updated;
  }
  return null;
};
