import { useEventioAuthRefreshToken } from "@/api/eventio";
import { useStorageState } from "@/hooks/useStorageState";
import axios from "axios";
import React, { useContext, useEffect, createContext, useState } from "react";

export type Session = {
  token: string;
  refreshToken: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type AuthContextType = {
  signIn: (
    token: string,
    refreshToken: string,
    id: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => void;
  signOut: () => void;
  session: Session | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }
  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] =
    useStorageState<Session>("session");

  const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const { mutateAsync } = useEventioAuthRefreshToken({
    mutation: {
      onSuccess: ({ data, headers }) => {
        if (session) {
          setSession({
            token: headers.authorization,
            refreshToken: session.refreshToken,
            id: session.id,
            email: session.email,
            firstName: session.firstName,
            lastName: session.lastName,
          });
        }
      },
    },
  });

  useEffect(() => {
    if (!session) return;
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const request = error.config;
        // If the error is a 401 and we have a refresh token, refresh the JWT token
        if (
          error.response.status === 401 &&
          session.refreshToken &&
          !request?.retry
        ) {
          const response = await mutateAsync({
            data: {
              refreshToken: session.refreshToken,
            },
          });
          // Prevents repeating same request
          request.retry = true;
          request.headers.Authorization = response.headers.authorization;
          return axios(request);
        }

        // Return the original error if we can't handle it
        return Promise.reject(error);
      },
    );
  }, [session, isRefreshingToken]);

  useEffect(() => {
    const interceptorId = axios.interceptors.request.use((config) => {
      return {
        ...config,
        headers: session?.token
          ? {
              ...config.headers,
              Authorization: session.token,
            }
          : config.headers,
      };
    });

    return () => {
      axios.interceptors.request.eject(interceptorId);
    };
  }, [session, session?.token]);

  return (
    <AuthContext.Provider
      value={{
        signIn: (
          token: string,
          refreshToken: string,
          id: string,
          email: string,
          firstName: string,
          lastName: string,
        ) => {
          setSession({ token, refreshToken, id, email, firstName, lastName });
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
