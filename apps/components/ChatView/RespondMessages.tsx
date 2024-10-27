import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { protectedAxios } from "@/utils/protectedAxios";

interface RespondMessagesProps {
  message: string;
  key: string;
}

const Audio = ({ audioPath }: { audioPath: string }) => {
  const [audioUrl, setAudioUrl] = React.useState<string>("");

  const getAudio = async () => {
    try {
      const response = await protectedAxios.get(`/poll`, {
        responseType: "blob",
        params: {
          filePath: audioPath,
        },
      });
      const audioUrl = URL.createObjectURL(response.data);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  useEffect(() => {
    getAudio();

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  return <audio src={audioUrl} controls />;
};

const Video = ({ videoPath }: { videoPath: string }) => {
  const [videoUrl, setVideoUrl] = React.useState<string>("");
  console.log("videoPath: ", videoPath);

  const getVideo = async () => {
    try {
      const response = await protectedAxios.get(`/poll`, {
        responseType: "blob",
        params: {
          filePath: videoPath,
        },
      });
      const videoUrl = URL.createObjectURL(response.data);
      setVideoUrl(videoUrl);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  useEffect(() => {
    getVideo();

    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, []);

  return <video src={videoUrl} controls />;
};

const RespondMessages = ({ message, key }: RespondMessagesProps) => {
  //! should parse the message in elsewhere not here
  const respond = JSON.parse(message);
  const respond_messages = respond.reduce(
    (acc: string, message: any) => acc + (acc ? " " : "") + message.sentence,
    ""
  );

  const audioPathArray = respond.reduce(
    (acc: string[], message: any) => [...acc, message.audio_file_path],
    []
  );

  const videoPathArray = audioPathArray.map((audioPath: string) =>
    audioPath.replace("audio", "Real3D").replace(".mp3", ".mp4")
  );

  return (
    <div
      className="max-w-[80%] flex rounded-lg p-2 text-sm bg-slate-200"
      key={key}
    >
      <Tabs defaultValue="response" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="talking_head">Video</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
        </TabsList>
        <TabsContent value="talking_head">
          <Card>
            <CardContent className="space-y-2">
              {videoPathArray?.map((videoPath: string) => (
                <Video videoPath={videoPath} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="response">
          <Card>
            <CardContent className="space-y-2">
              <h1 className="text-lg font-semibold uppercase">Transcript</h1>
              <p className={`text-sm`}>{respond_messages}</p>
              <h1 className="text-lg font-semibold uppercase">Audio</h1>
              {audioPathArray?.map((audioPath: string) => (
                <Audio audioPath={audioPath} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RespondMessages;
