"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import VideoForm from "../form/VideoForm";

const VideoCard = ({}) => {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-center">Select an video</CardTitle>
      </CardHeader>

      <VideoForm />
    </Card>
  );
};

export default VideoCard;
