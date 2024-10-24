import React from "react";

interface UserQuestionsProps {
  message: string;
  key: string;
}

const UserQuestions = ({ message, key }: UserQuestionsProps) => {
  return (
    <p
      className={`max-w-[80%] flex rounded-lg p-2 text-sm self-end bg-blue-200`}
      key={key}
    >
      {message}
    </p>
  );
};

export default UserQuestions;
