import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { protectedAxios } from "@/utils/protectedAxios";
import { AxiosProgressEvent } from "axios";
import { Progress } from "../ui/progress";
import { ModalType, useModalStore } from "@/stores/modalStore";
import { Icon } from "@iconify/react";

const getVideoURL = (file: File) => URL.createObjectURL(file);

interface VideoThumbnailProps {
  video: File | null;
  unselectVideo: () => void;
}

const VideoPreview = ({ video, unselectVideo }: VideoThumbnailProps) => {
  return (
    <div className="relative h-full w-full">
      {video ? (
        <>
          <Icon
            icon="proicons:cancel"
            onClick={unselectVideo}
            className="absolute right-2 text-black w-6 h-6 top-2 hover:cursor-pointer z-50"
          />
          <video
            controls
            className="w-full h-full"
            preload="none"
            autoPlay
            muted
            playsInline
          >
            <source src={getVideoURL(video)} />
          </video>
        </>
      ) : (
        <div className="h-full pb-5 flex justify-center items-end text-center ">
          Upload Video
        </div>
      )}
    </div>
  );
};

interface VideoFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const VideoForm = ({ className }: VideoFormProps) => {
  const [video, setVideo] = React.useState<File | null>(null);
  const [uploadPercentage, setUploadPercentage] = React.useState(0);
  const isActive =
    useModalStore((state) => state.activeModal) === ModalType.AVATAR;

  React.useEffect(() => {
    if (!isActive) {
      setVideo(null);
      setUploadPercentage(0);
    }
  }, [isActive]);

  const unselectVideo = () => {
    setVideo(null);
    setUploadPercentage(0);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
    }
  };

  const handleSubmit = async () => {
    if (!video) return;
    const fileType = video.type.split("/");

    const newVideo = new File([video], `DrivingVideo.${fileType[1]}`, {
      type: video.type,
    });
    console.log(fileType[1]);

    const formData = new FormData();
    formData.append("uploadedFile", newVideo);

    await protectedAxios
      .postForm("/upload", formData, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          setUploadPercentage(
            Math.round((progressEvent.loaded / progressEvent.total!) * 100)
          );
        },
      })
      .catch((e) => {
        console.error("Error uploading Video:", e);
        setUploadPercentage(0);
      });
  };

  return (
    <>
      <div className={cn("p-4 flex justify-center items-center", className)}>
        <div className=" bg-slate-200 w-[400px] h-[400px] rounded-md border-dotted border-2 border-black">
          <Label htmlFor="video" className="hover:cursor-pointer">
            <VideoPreview video={video} unselectVideo={unselectVideo} />
          </Label>
          <Input
            id="video" //TODO: rename
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="hidden"
          />
          <Progress className="-my-1" value={uploadPercentage} />
        </div>
      </div>
      <div className={cn("p-4 flex justify-center items-center", className)}>
        <Button onClick={handleSubmit}>Upload Video</Button>
      </div>
    </>
  );
};

export default VideoForm;
