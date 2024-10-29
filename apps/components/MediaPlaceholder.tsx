import React, { useEffect } from "react";
import { protectedAxios } from "@/utils/protectedAxios";

interface MediaProps {
  filePath: string;
  fileType: "audio" | "video";
}

const wait = (ms = 1000) => {
  return new Promise((resolve) => {
    console.log(`waiting ${ms} ms...`);
    setTimeout(resolve, ms);
  });
};

const poll = async (
  fn: any,
  fnCondition: (result: any) => boolean,
  ms: number
) => {
  let result = await fn();
  while (fnCondition(result)) {
    await wait(ms);
    result = await fn();
  }
  return result;
};

const MediaPlaceholder = ({ filePath, fileType }: MediaProps) => {
  const [mediaUrl, setMediaUrl] = React.useState<string>("");

  const fetchMedia = async () => {
    const response = await protectedAxios.get(`/poll`, {
      responseType: "blob",
      params: {
        filePath: filePath,
      },
    });

    const res = response.data;

    let responseJson;
    let hasMedia = false;
    try {
      responseJson = JSON.parse(await res.text());
    } catch (e) {
      if (e instanceof SyntaxError) hasMedia = true;
    }

    console.log("waiting for ", filePath, fileType);

    return { hasMedia, res };
  };

  const condition = ({ hasMedia, res }: { hasMedia: boolean; res: any }) => {
    return !hasMedia;
  };

  const getMedia = async () => {
    try {
      const result = await poll(fetchMedia, condition, 5000);

      if (result.hasMedia) {
        const mediaUrl = URL.createObjectURL(result.res);
        setMediaUrl(mediaUrl);
      }
    } catch (error) {
      console.error(`Error fetching ${filePath} ${fileType}:`, error);
    }
  };

  useEffect(() => {
    getMedia();

    return () => {
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    };
  }, []);

  if (mediaUrl === "") return <div>Pending {filePath}</div>;

  return fileType === "audio" ? (
    <audio src={mediaUrl} controls />
  ) : (
    <video src={mediaUrl} controls />
  );
};

export default MediaPlaceholder;
