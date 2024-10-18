import React, { useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { EMOTION_TYPES } from "@/constants";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { protectedAxios } from "@/utils/protectedAxios";
import { AxiosProgressEvent } from "axios";
import { Progress } from "../ui/progress";
import { ModalType, useModalStore } from "@/stores/modalStore";
import { Icon } from "@iconify/react";
import { set } from "zod";

const getImgURL = (file: File) => URL.createObjectURL(file);

interface ImageThumbnailProps {
  img: File | null;
  emotion: EMOTION_TYPES;
  unselectImage: () => void;
}

const ImageThumbnail = ({
  img,
  emotion,
  unselectImage,
}: ImageThumbnailProps) => {
  return (
    <div className="relative h-full w-full">
      {img ? (
        <>
          <Icon
            icon="proicons:cancel"
            onClick={unselectImage}
            className="absolute right-2 text-black w-6 h-6 top-2 hover:cursor-pointer z-50"
          />
          <Image
            src={getImgURL(img)}
            alt={`Upload ${emotion} image`}
            fill
            objectFit="contain"
          />
        </>
      ) : (
        <div className="h-full pb-5 flex justify-center items-end text-center ">
          Upload {emotion} Image
        </div>
      )}
    </div>
  );
};

interface ImageFormProps extends React.HTMLAttributes<HTMLDivElement> {
  emotion: EMOTION_TYPES;
}

const ImageForm = ({ emotion, className }: ImageFormProps) => {
  const [img, setImg] = React.useState<File | null>(null);
  const [uploadPercentage, setUploadPercentage] = React.useState(0);
  const isActive =
    useModalStore((state) => state.activeModal) === ModalType.AVATAR;

  useEffect(() => {
    if (!isActive) {
      setImg(null);
      setUploadPercentage(0);
    }
  }, [isActive]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImg(file);
      setUploadPercentage(0);
    }
  };

  const unselectImage = () => {
    setImg(null);
    setUploadPercentage(0);
  };

  const handleSubmit = async () => {
    if (!img) return;

    const formData = new FormData();
    formData.append("uploadedFile", img);
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
        console.error("Error uploading image:", e);
        setUploadPercentage(0);
      });
  };

  return (
    <>
      <div className={cn("p-4 flex justify-center items-center", className)}>
        <div className=" bg-slate-200 w-[400px] h-[400px] rounded-md border-dotted border-2 border-black">
          <Label htmlFor={emotion} className="hover:cursor-pointer">
            <ImageThumbnail
              img={img}
              emotion={emotion}
              unselectImage={unselectImage}
            />
          </Label>
          <Input
            type="file"
            id={emotion}
            accept="image/*"
            onChange={handleImageChange}
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
          image
        </Button>
      </div>
    </>
  );
};

export default ImageForm;
