"use client";

import React from "react";
import {
  type RegisterUserFormSchema,
  RegisterUserSchema,
} from "@packages/schema/registerSchema";
import { registerUserResponse } from "@packages/types/jwt";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import useUserStore from "@/stores/userStore";
import Modal from "../ui/modal";
import { Icon } from "@iconify/react";

interface AvatarSettingsFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AvatarSettingsForm = ({ isOpen, onClose }: AvatarSettingsFormProps) => {
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
    try {
      // TODO: turn axios
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const userResponse: registerUserResponse = await response.json();
      console.log(userResponse);
      onCreateUser(userResponse);
      localStorage.setItem("accessToken", userResponse.accessToken);

      onClose();
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <h1>Avatar Settings</h1>
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
          Create
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

export default AvatarSettingsForm;
