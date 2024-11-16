"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmotionSelector } from "../EmotionSelector";
import { EMOTIONS_LIST, type EMOTION_TYPES } from "@/constants";
import ImageForm from "../form/ImageForm";

const ImageCard = () => {
  const [selectedEmotion, setSelectedEmotion] =
    React.useState<EMOTION_TYPES>("default");

  const handleSelectEmotion = (emotion: EMOTION_TYPES) => {
    setSelectedEmotion(emotion);
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-center">
          Select an image for each emotion
        </CardTitle>
        <EmotionSelector
          selectedEmotion={selectedEmotion}
          handleSelectEmotion={handleSelectEmotion}
        />
      </CardHeader>
      {EMOTIONS_LIST.map((emotion) => (
        <ImageForm
          key={emotion}
          emotion={emotion}
          className={emotion !== selectedEmotion ? "hidden" : ""}
        />
      ))}
    </Card>
  );
};

export default ImageCard;
