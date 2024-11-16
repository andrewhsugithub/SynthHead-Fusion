import React from "react";

interface UserQuestionsProps {
  message: string;
}

const UserQuestions = ({ message }: UserQuestionsProps) => {
  return (
    <p
      className={`max-w-[80%] flex rounded-lg p-2 text-sm self-end bg-blue-200`}
    >
      {message}
    </p>
  );
};

export default UserQuestions;
