import { useState, useEffect } from "react";

import { database } from "../services/firebase";

import { useAuth } from "./useAuth";

// Type das questions que vem do banco de dados
type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswer: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

// Type das questions após o parse
type Questions = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswer: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`); // Pega a referencia da sala do firebase pelo id da sala
    // O método on fico ouvindo as mudanças e trazendo elas sempre que algo muda na room
    roomRef.on("value", (room) => {
      const databaseRoom = room.val(); // Ele busca a room especifica
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}; // Ele busca e tipa todas as questions daquela room especifica

      //* Método que transforma o formato das questions que vem do firebase em algo parecido com uma Matriz -> [key, value]
      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswer: value.isAnswer,
            likeCount: Object.values(value.likes ?? {}).length, // Verifica quantos likes tem
            likeId: Object.entries(value.likes ?? {}).find(
              // Verifica se existe um like da mesma pessoa para nçao ter mais de um like por pessoa
              ([key, like]) => like.authorId === user?.id
            )?.[0], // * ?. Se não achar o like não retorna nada
          };
        }
      );

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      roomRef.off("value");
    };
  }, [roomId, user?.id]); // Ele executa sempre que o roomId ou o userId mudar

  return { questions, title };
}
