import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";

import Button from "../../components/Button";

function NewRoom() {
  return (
    <div className="flex items-stretch h-screen">
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
          <form className="flex flex-col">
            <input
              className="h-12 bg-white py-0 px-4 rounded-lg border border-solid border-gray-400"
              type="text"
              placeholder="Digite o código da sala"
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default NewRoom;
