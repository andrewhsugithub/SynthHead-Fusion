import React, { useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { EMOTION_TYPES } from "@/constants";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { protectedAxios } from "@/utils/protectedAxios";
import { AxiosProgressEvent } from "axios";
import { Progress } from "../ui/progress";
import { ModalType, useModalStore } from "@/stores/modalStore";
import { Icon } from "@iconify/react";

const getAudioURL = (file: File) => URL.createObjectURL(file);

interface AudioProps {
  audio: File | null;
  emotion: EMOTION_TYPES;
  unselectAudio: () => void;
}

const AudioThumbnail = ({ audio, emotion, unselectAudio }: AudioProps) => {
  return (
    <div className="relative h-full w-full">
      {audio ? (
        <>
          <Icon
            icon="proicons:cancel"
            onClick={unselectAudio}
            className="absolute right-2 text-black w-6 h-6 top-2 hover:cursor-pointer z-50"
          />
          <audio
            controls
            src={getAudioURL(audio)}
            className="relative h-full w-full"
          ></audio>
        </>
      ) : (
        <div className="h-full pb-5 flex justify-center items-end text-center ">
          Upload {emotion} Audio
        </div>
      )}
    </div>
  );
};

interface AudioFormProps extends React.HTMLAttributes<HTMLDivElement> {
  emotion: EMOTION_TYPES;
}

const AudioForm = ({ emotion, className }: AudioFormProps) => {
  const [audio, setAudio] = React.useState<File | null>(null);
  const [uploadPercentage, setUploadPercentage] = React.useState(0);
  const isActive =
    useModalStore((state) => state.activeModal) === ModalType.AVATAR;

  useEffect(() => {
    if (!isActive) {
      setAudio(null);
      setUploadPercentage(0);
    }
  }, [isActive]);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudio(file);
      setUploadPercentage(0);
    }
  };

  const unselectAudio = () => {
    setAudio(null);
    setUploadPercentage(0);
  };

  const handleSubmit = async () => {
    if (!audio) return;
    const fileType = audio.type.split("/");

    const newAudio = new File([audio], `${emotion}.${fileType[1]}`, {
      type: audio.type,
    });
    console.log(fileType[1]);
    console.log(newAudio.name);

    const formData = new FormData();
    formData.append("uploadedFile", newAudio);
    formData.append("emotion", emotion);

    await protectedAxios
      .postForm("/upload", formData, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          setUploadPercentage(
            Math.round((progressEvent.loaded / progressEvent.total!) * 100)
          );
        },
      })
      .catch((e) => {
        console.error("Error uploading audio:", e);
        setUploadPercentage(0);
      });
  };

  return (
    <>
      <div className={cn("p-4 flex justify-center items-center", className)}>
        <div className=" bg-slate-200 w-[400px] h-[100px] rounded-md border-dotted border-2 border-black">
          <Label htmlFor={emotion} className="hover:cursor-pointer">
            <AudioThumbnail
              audio={audio}
              emotion={emotion}
              unselectAudio={unselectAudio}
            />
          </Label>
          <Input
            type="file"
            id={emotion}
            accept="audio/*"
            onChange={handleAudioChange}
            className="hidden"
          />
          <Progress className="-my-1" value={uploadPercentage} />
        </div>
      </div>
      <div className={cn("p-4 flex justify-center items-center", className)}>
        <Button onClick={handleSubmit}>
          Upload
          <span className="text-red-500 uppercase italic">
            &nbsp;{emotion}&nbsp;
          </span>
          audio
        </Button>
      </div>
    </>
  );
};

export default AudioForm;
