"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  AuthUser,
  AuthenticatedUser,
  UserRole,
} from "@/features/auth/types";
import { getDemoUser } from "@/features/auth/demo-users";
import { env } from "@/lib/env";

type AuthState = {
  role: UserRole | null;
  hydrated: boolean;
  user: AuthUser | AuthenticatedUser | null;
  accessToken: string | null;
  setSession: (accessToken: string, user: AuthenticatedUser) => void;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      hydrated: false,
      user: null,
      accessToken: null,
      setSession: (accessToken, user) =>
        set({ accessToken, user, role: user.role, hydrated: true }),
      loginAsRole: (role) => {
        if (env.useMocks)
          set({ role, user: getDemoUser(role), accessToken: null });
      },
      logout: () => set({ role: null, user: null, accessToken: null }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: env.useMocks ? "uniloop-demo-session" : "uniloop-http-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        env.useMocks
          ? { role: state.role }
          : { accessToken: state.accessToken },
      merge: (persisted: unknown, current) => {
        if (!persisted || typeof persisted !== "object") return current;
        if (env.useMocks)
          return {
            ...current,
            role:
              "role" in persisted &&
              (persisted.role === "STUDENT" || persisted.role === "PROFESSOR" || persisted.role === "ADMIN")
                ? persisted.role
                : null,
          };
        return {
          ...current,
          accessToken:
            "accessToken" in persisted &&
            typeof persisted.accessToken === "string" &&
            persisted.accessToken.length <= 8192
              ? persisted.accessToken
              : null,
        };
      },
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        if (env.useMocks && state) {
          if (state.role) state.loginAsRole(state.role);
          state.setHydrated(true);
        }
      },
    },
  ),
);
export function sessionProfileId(): string {
  const user = useAuthStore.getState().user;
  return user ? ("profileId" in user ? user.profileId : user.id) : "anonymous";
}
