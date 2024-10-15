"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";

import { EMOTIONS_LIST, type EMOTION_TYPES } from "@/constants";

interface EmotionSelectorProps {
  selectedEmotion: EMOTION_TYPES;
  handleSelectEmotion: (emotion: EMOTION_TYPES) => void;
}

export function EmotionSelector({
  selectedEmotion,
  handleSelectEmotion,
}: EmotionSelectorProps) {
  return (
    <Select value={selectedEmotion} onValueChange={handleSelectEmotion}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an emotion" />
      </SelectTrigger>
      <SelectContent>
        <SelectScrollUpButton />
        <SelectGroup>
          <SelectLabel>Emotions</SelectLabel>
          {EMOTIONS_LIST.map((emotion) => (
            <SelectItem key={emotion} value={emotion}>
              {emotion}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectScrollDownButton />
      </SelectContent>
    </Select>
  );
}
