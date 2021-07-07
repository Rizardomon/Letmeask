import { useState, useEffect, FormEvent } from "react";
import { useParams } from "react-router-dom";

import logoImg from "../../assets/images/logo.svg";

import Button from "../../components/Button";
import RoomCode from "../../components/RoomCode";

import { database } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";

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
};

type RoomParams = {
  id: string;
};

function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>(); // Pega os parametros da rota
  const roomId = params.id; // Pega o id que está na rota do browser

  const [newQuestion, setNewQuestion] = useState("");
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
          };
        }
      );

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
  }, [roomId]); // Ele executa sempre que o roomId mudar

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("You must be logged in");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighlighted: false,
      isAnswer: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question); // Cria uma nova questão na sala que está no momento

    setNewQuestion("");
  }

  return (
    <div className="h-screen bg-gray-50 font-body">
      <header className="border-b-2 border-gray-100">
        <div className="flex justify-between items-center max-w-5xl my-0 mx-auto p-6">
          <img src={logoImg} alt="Letmeask" className="max-h-11" />
          <RoomCode code={roomId} />
        </div>
      </header>
      <main className="max-w-4xl my-0 mx-auto">
        <div className="flex items-center mx-0 mb-6 mt-8">
          <h1 className="font-title font-bold text-2xl text-gray-800">
            Sala {title}
          </h1>
          {questions.length > 0 && (
            <span className="ml-4 bg-pink-500 rounded-full py-2 px-4 text-white font-medium text-sm">
              {questions.length} pergunta(s)
            </span>
          )}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar"
            value={newQuestion}
            onChange={(event) => setNewQuestion(event.target.value)}
            className="w-full resize-y min-h-full max-h-32  border-0 p-4 rounded-lg bg-white shadow-md"
          />
          <div className="flex justify-between items-center mt-4">
            {user ? (
              <div className="flex items-center">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-2 text-sm font-medium text-gray-800">
                  {user.name}
                </span>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-500">
                Para enviar uma pergunta,
                <button className="text-purple-500 underline text-sm font-medium">
                  faça seu login
                </button>
                .
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Room;
