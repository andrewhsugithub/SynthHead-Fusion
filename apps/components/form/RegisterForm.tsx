"use client";

import React from "react";
import {
  type RegisterUserFormSchema,
  RegisterUserSchema,
} from "@packages/schema/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import useUserStore from "@/stores/userStore";
import Modal from "../ui/modal";
import { Icon } from "@iconify/react";

interface RegisterFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterForm = ({ isOpen, onClose }: RegisterFormProps) => {
  const { hasUserLogin, onCreateUser } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserFormSchema>({
    resolver: zodResolver(RegisterUserSchema),
  });
  const onSubmit: SubmitHandler<RegisterUserFormSchema> = async (data) => {
    console.log(data);
    onCreateUser(data);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          placeholder="Username"
          {...register("username")}
        />
        {errors.username && <p>{errors.username.message}</p>}
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          placeholder="********"
          {...register("password")}
        />
        {errors.password && <p>{errors.password.message}</p>}
        <Button variant={"outline"} type="submit">
          Register
        </Button>
      </form>

      <Modal.Action>
        <Button className="w-[7.5rem]" onClick={onClose}>
          <Icon className="text-xl" icon="ic:outline-close" />
          <span>Cancel</span>
        </Button>
      </Modal.Action>
    </Modal>
  );
};

export default RegisterForm;
