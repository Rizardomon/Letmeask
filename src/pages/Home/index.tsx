import { useHistory } from "react-router-dom";
import { FormEvent, useState } from "react";

import { database } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";

import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";
import googleIconImg from "../../assets/images/google-icon.svg";

import "./styles.scss";

import Button from "../../components/Button";

function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
  };

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    // Buscando pela sala no Firebase pelo código digitado
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    // Verifica se a sala existe no Firebase
    if (!roomRef.exists()) {
      alert("Could not find room!");
    }

    // Verifica se a sala já foi fechada e não permite mais a entrada
    if (roomRef.val().endedAt) {
      alert("Room already ended!");
      return;
    }

    // Se a sala existe ele redireciona
    history.push(`/rooms/${roomCode}`);
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
          <button
            onClick={handleCreateRoom}
            className="flex items-center justify-center mt-16 h-12 bg-red-500 font-body font-medium text-white rounded-lg hover:bg-red-700 transition duration-500"
          >
            <img src={googleIconImg} alt="Google" className="mr-2" />
            Crie sua sala com o Google
          </button>
          <span
            id="separator"
            className="flex font-body text-sm text-gray-400 my-8 mx-0 items-center"
          >
            ou entre em uma sala
          </span>
          <form onSubmit={handleJoinRoom} className="flex flex-col">
            <input
              className="h-12 bg-white py-0 px-4 mb-3 rounded-lg border border-solid border-gray-400"
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Home;
