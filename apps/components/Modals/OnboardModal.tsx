"use client";

import React from "react";
import Modal from "../ui/modal";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import RegisterForm from "../form/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUserStore from "@/stores/userStore";
import LogInForm from "../form/LogInForm";

interface OnboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardModal = ({ isOpen, onClose }: OnboardModalProps) => {
  const isLoggedIn = useUserStore((state) => state.hasUserLogin);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Tabs
        defaultValue={isLoggedIn ? "login" : "register"}
        className="w-[400px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="login">Log In</TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <RegisterForm onClose={onClose} />
        </TabsContent>
        <TabsContent value="login">
          <LogInForm onClose={onClose} />
        </TabsContent>
      </Tabs>

      <Modal.Action>
        <Button className="w-[7.5rem]" onClick={onClose}>
          <Icon className="text-xl" icon="ic:outline-close" />
          <span>Cancel</span>
        </Button>
      </Modal.Action>
    </Modal>
  );
};

export default OnboardModal;
