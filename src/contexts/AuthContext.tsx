import { createContext, useState, useEffect, ReactNode } from "react";

import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
};

// Tipos do contexto
type AuthContextType = {
  user: User | undefined; // Pode ser do tipo user ou undefined
  signInWithGoogle: () => Promise<void>;
};

type AuthContextProviderType = {
  children: ReactNode;
};

// Criando contexto de autenticação para toda a aplicação
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderType) {
  const [user, setUser] = useState<User>();

  // Se o usuário já estiver logado preencher novamente com as informações de login assim que a página carregar
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account.");
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });

    // Se desinscrever do eventListener após ele ser usado
    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider(); // Faz o login com o Google

    const result = await auth.signInWithPopup(provider); // Abre um popup para o login

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google Account.");
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  };
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}
