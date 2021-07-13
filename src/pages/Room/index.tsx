import { useState, FormEvent } from "react";
import { useParams } from "react-router-dom";

import logoImg from "../../assets/images/logo.svg";

import Button from "../../components/Button";
import RoomCode from "../../components/RoomCode";
import Question from "../../components/Question";

import { database } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import { useRoom } from "../../hooks/useRoom";

import "./styles.scss";

type RoomParams = {
  id: string;
};

function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>(); // Pega os parametros da rota
  const roomId = params.id; // Pega o id que está na rota do browser

  const [newQuestion, setNewQuestion] = useState("");
  const { questions, title } = useRoom(roomId);

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

        <div className="mt-8">
          {questions.map((question) => {
            // Mapeando todas as questões
            // Pra cada questão do Firebase retorna o componente
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  aria-label="Marcar como gostei"
                  className="liked-button flex items-end gap-2 text-gray-400"
                >
                  <span>10</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                      stroke="#737380"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Room;