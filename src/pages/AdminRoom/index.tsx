import { useHistory, useParams } from "react-router-dom";

import logoImg from "../../assets/images/logo.svg";
import deleteImg from "../../assets/images/delete.svg";

import Button from "../../components/Button";
import RoomCode from "../../components/RoomCode";
import Question from "../../components/Question";

import { database } from "../../services/firebase";
import { useRoom } from "../../hooks/useRoom";

type RoomParams = {
  id: string;
};

function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>(); // Pega os parametros da rota
  const roomId = params.id; // Pega o id que está na rota do browser

  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    if (window.confirm("Tem certeza que deseja excluir essa pergunta?")) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      });

      history.push("/");
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que deseja excluir essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div className="h-screen bg-gray-50 font-body">
      <header className="border-b-2 border-gray-100">
        <div className="flex justify-between items-center max-w-5xl my-0 mx-auto p-6">
          <img src={logoImg} alt="Letmeask" className="max-h-11" />
          <div className="flex gap-4">
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} isOutlined>
              Encerrar sala
            </Button>
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
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default AdminRoom;
