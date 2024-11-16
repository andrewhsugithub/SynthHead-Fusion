import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MediaPlaceholder from "../MediaPlaceholder";

interface RespondMessagesProps {
  message: string;
}

const RespondMessages = ({ message }: RespondMessagesProps) => {
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
    <div className="max-w-[80%] flex rounded-lg p-2 text-sm bg-slate-200">
      <Tabs defaultValue="response" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="talking_head">Video</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
        </TabsList>
        <TabsContent value="talking_head">
          <Card>
            <CardContent className="space-y-2">
              {videoPathArray?.map((videoPath: string) => (
                <MediaPlaceholder
                  key={videoPath}
                  filePath={videoPath}
                  fileType="video"
                />
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
                <MediaPlaceholder
                  key={audioPath}
                  filePath={audioPath}
                  fileType="audio"
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RespondMessages;
