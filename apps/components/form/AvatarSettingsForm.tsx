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
import Modal from "../ui/modal";
import { Icon } from "@iconify/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ImageCard from "../Cards/ImageCard";
import { EmotionSelector } from "../EmotionSelector";

interface AvatarSettingsFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AvatarSettingsForm = ({ isOpen, onClose }: AvatarSettingsFormProps) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <h1>Avatar Settings</h1>
      <Tabs defaultValue="images" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="images">Upload Images</TabsTrigger>
          <TabsTrigger value="audios">Upload Audios</TabsTrigger>
          <TabsTrigger value="videos">Upload Videos</TabsTrigger>
        </TabsList>
        <TabsContent value="images">
          <ImageCard />
          {/* <EmotionSelector /> */}
        </TabsContent>
        <TabsContent value="audios">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="videos"></TabsContent>
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

export default AvatarSettingsForm;
