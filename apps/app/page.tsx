"use client";
import {
  type RegisterUserFormSchema,
  RegisterUserSchema,
} from "@packages/schema/registerSchema";
import { registerUserResponse } from "@packages/types/jwt";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export default function Home() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterUserFormSchema>({
    resolver: zodResolver(RegisterUserSchema),
  });
  const onSubmit: SubmitHandler<RegisterUserFormSchema> = async (data) => {
    console.log(data);
    try {
      // TODO: turn axios
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const userResponse: registerUserResponse = await response.json();
      console.log(userResponse);
      localStorage.setItem("accessToken", userResponse.accessToken);
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="username" {...register("username")} />
        {errors.username && <p>{errors.username.message}</p>}

        <input
          type="password"
          placeholder="password"
          {...register("password")}
        />
        {errors.password && <p>{errors.password.message}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
