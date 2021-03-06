import { ReactNode } from "react";

import "./styles.scss";

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswer?: boolean;
  isHighlighted?: boolean;
};

function Question({
  content,
  author,
  children,
  isAnswer = false,
  isHighlighted = false,
}: QuestionProps) {
  // Pegando apenas as props necessárias com desestruturação
  return (
    <div
      className={`
      question bg-white rounded-lg shadow-lg p-6
      ${
        isHighlighted && !isAnswer
          ? "bg-purple-50 border border-purple-500"
          : ""
      }
      ${isAnswer ? "bg-gray-200" : ""}
      `}
    >
      <p className="text-gray-800">{content}</p>
      <footer className="flex justify-between items-center mt-6">
        <div className="flex items-center">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-8 h-8 rounded-full"
          />
          <span
            className={`ml-2 text-sm ${
              isHighlighted ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {author.name}
          </span>
        </div>
        <div className="flex gap-4">{children}</div>
      </footer>
    </div>
  );
}

export default Question;
