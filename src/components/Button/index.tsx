import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

function Button(props: ButtonProps) {
  return (
    <button
      className="h-12 mt-4 bg-purple-500 font-body font-medium text-white rounded-lg hover:bg-purple-700 transition duration-500"
      {...props}
    />
  );
}

export default Button;
