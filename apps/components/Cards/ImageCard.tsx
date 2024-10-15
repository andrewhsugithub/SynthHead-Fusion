"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { EmotionSelector } from "../EmotionSelector";
import { type EMOTION_TYPES } from "@/constants";
import ImageForm from "../form/ImageForm";

const ImageCard = ({}) => {
  const [selectedEmotion, setSelectedEmotion] =
    React.useState<EMOTION_TYPES>("happy");

  const handleSelectEmotion = (emotion: EMOTION_TYPES) => {
    setSelectedEmotion(emotion);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select an image for each emotion</CardTitle>
        <EmotionSelector
          selectedEmotion={selectedEmotion}
          handleSelectEmotion={handleSelectEmotion}
        />
        <CardDescription>{selectedEmotion}</CardDescription>
      </CardHeader>
      <ImageForm emotion={selectedEmotion} />
      <CardFooter>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  );
};

export default ImageCard;
