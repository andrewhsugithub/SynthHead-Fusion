import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RespondMessagesProps {
  message: string;
  key: string;
}

const RespondMessages = ({ message, key }: RespondMessagesProps) => {
  //! should parse the message in elsewhere not here
  const respond = JSON.parse(message);
  const respond_messages = respond.reduce(
    (acc: string, message: any) => acc + (acc ? " " : "") + message.sentence,
    ""
  );

  // TODO: Stream audios, now we just temporarily show the audio paths
  const audio = respond.reduce(
    (acc: string, message: any) =>
      acc + (acc ? "\n" : "") + message.audio_file_path,
    ""
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
        <TabsContent value="response">
          <Card>
            <CardContent className="space-y-2">
              <h1 className="text-lg font-semibold uppercase">Transcript</h1>
              <p className={`text-sm`}>{respond_messages}</p>
              <h1 className="text-lg font-semibold uppercase">Audio</h1>
              <p className={`text-sm`}>{audio}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RespondMessages;
