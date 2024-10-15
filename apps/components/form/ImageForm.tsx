import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { EMOTION_TYPES } from "@/constants";
import Image from "next/image";

interface ImageThumbnailProps {
  src: string | null;
  emotion: EMOTION_TYPES;
}

const ImageThumbnail = ({ src, emotion }: ImageThumbnailProps) => {
  return (
    <div className="relative h-full w-full">
      {src ? (
        <Image
          src={src}
          alt={`Upload ${emotion} image`}
          fill
          objectFit="contain"
        />
      ) : (
        <div className="h-full pb-5 flex justify-center items-end text-center ">
          Upload {emotion} Image
        </div>
      )}
    </div>
  );
};

interface ImageFormProps {
  emotion: EMOTION_TYPES;
}

const ImageForm = ({ emotion }: ImageFormProps) => {
  const [img, setImg] = React.useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImg(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-4 flex justify-center items-center">
      <div className=" bg-slate-200 w-[400px] h-[400px] rounded-md border-dotted border-2 border-black">
        <Label htmlFor={emotion} className="hover:cursor-pointer">
          <ImageThumbnail src={img} emotion={emotion} />
        </Label>
        <Input
          type="file"
          id={emotion}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageForm;
