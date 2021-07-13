import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

function Button({ isOutlined = false, ...props }: ButtonProps) {
  return (
    <button
      className={`${
        isOutlined
          ? "h-10 px-4 bg-white border border-purple-500 text-purple-500 font-medium rounded-lg hover:bg-purple-100 transition duration-500"
          : "h-12 px-4 bg-purple-500 font-body font-medium text-white rounded-lg hover:bg-purple-700 transition duration-500"
      }`}
      {...props}
    />
  );
}

export default Button;
