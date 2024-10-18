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
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface RegisterFormProps {
  onClose: () => void;
}

const RegisterForm = ({ onClose }: RegisterFormProps) => {
  const onCreateUser = useUserStore((state) => state.onCreateUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterUserFormSchema>({
    resolver: zodResolver(RegisterUserSchema),
  });
  const onSubmit: SubmitHandler<RegisterUserFormSchema> = async (data) => {
    console.log(data);
    onCreateUser(data);
    reset();
    onClose();
  };

  return (
    <Card className="mx-4 p-4 pt-0">
      <CardHeader>
        <CardTitle className="text-center">Register</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-rows-2 gap-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              placeholder="Username"
              {...register("username")}
            />
            {errors.username && (
              <p className="absolute text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="********"
              {...register("password")}
            />
            {errors.password && (
              <p className="absolute text-red-500">{errors.password.message}</p>
            )}
          </div>
        </div>
        <div className="flex justify-center pt-4">
          <Button variant={"outline"} type="submit">
            Register
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default RegisterForm;
