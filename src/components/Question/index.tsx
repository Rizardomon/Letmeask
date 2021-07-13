import "./styles.css";

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
};

function Question({ content, author }: QuestionProps) {
  // Pegando apenas as props necessárias com desestruturação
  return (
    <div className="question bg-white rounded-lg shadow-lg p-6">
      <p className="text-gray-800">{content}</p>
      <footer className="flex justify-between items-center mt-6">
        <div className="flex items-center">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="ml-2 text-sm text-gray-400">{author.name}</span>
        </div>
        <div></div>
      </footer>
    </div>
  );
}

export default Question;
