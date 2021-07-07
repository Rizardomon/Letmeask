import copyImg from "../../assets/images/copy.svg";

type RoomCodeProps = {
  code: string;
};

function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code); // Método do browser para copiar o conteúdo
  }

  return (
    <button
      onClick={copyRoomCodeToClipboard}
      className="flex h-10 rounded-lg overflow-hidden bg-white border-2 border-purple-500"
    >
      <div className="flex h-full justify-center items-center py-0 px-3 bg-purple-500">
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span className="block self-center flex-1 w-60 py-0 pr-4 pl-3 text-sm font-medium">
        Sala #{props.code}
      </span>
    </button>
  );
}

export default RoomCode;
