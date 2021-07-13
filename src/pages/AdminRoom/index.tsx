import { useState, FormEvent } from "react";
import { useParams } from "react-router-dom";

import logoImg from "../../assets/images/logo.svg";

import Button from "../../components/Button";
import RoomCode from "../../components/RoomCode";
import Question from "../../components/Question";

import { database } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import { useRoom } from "../../hooks/useRoom";

type RoomParams = {
  id: string;
};

function AdminRoom() {
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
          <div className="flex gap-4">
            <RoomCode code={roomId} />
            <Button isOutlined>Encerrar sala</Button>
          </div>
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

        <div className="mt-8">
          {questions.map((question) => {
            // Mapeando todas as questões
            // Pra cada questão do Firebase retorna o componente
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default AdminRoom;
