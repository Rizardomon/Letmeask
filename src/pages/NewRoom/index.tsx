import { Link, useHistory } from "react-router-dom";
import { FormEvent, useState } from "react";

import { useAuth } from "../../hooks/useAuth";

import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";

import Button from "../../components/Button";
import { database } from "../../services/firebase";

function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState("");

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    // Definindo a reference das rooms do banco
    const roomRef = database.ref("rooms");

    // Efetivamente criando um documento de nova sala dentro do banco
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.name,
    });

    history.push(`/admin/rooms/${firebaseRoom.key}`); // key é o id do documento
  }

  return (
    <div className="flex items-stretch h-screen font-body">
      <aside className="flex flex-col justify-center w-7/12 px-20 py-32 bg-purple-500 text-white">
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
          className="max-w-xs"
        />
        <strong className="font-bold text-3xl font-title mt-4">
          Crie salas de Q&amp;A ao vivo
        </strong>
        <p className="text-2xl mt-4">
          Tire as dúvidas da sua audiência em tempo real
        </p>
      </aside>
      <main className="flex flex-auto items-center justify-center py-0 px-8 bg-gray-50">
        <div className="flex flex-col items-stretch justify-center w-full max-w-xs">
          <img src={logoImg} alt="Logo do Letmeask" className="self-center" />
          <h2 className="mt-14 font-title text-2xl font-bold self-center">
            Crie uma nova sala
          </h2>
          <form onSubmit={handleCreateRoom} className="flex flex-col mt-6">
            <input
              className="h-12 bg-white py-0 px-4 mb-3 rounded-lg border border-solid border-gray-400"
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p className="mt-4 text-sm text-gray-400 font-body">
            Quer entrar em uma sala já existente?{" "}
            <Link className="font-body text-pink-600" to="/">
              Clique aqui
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default NewRoom;
