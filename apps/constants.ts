export const GLOBAL_TITLE = "Synthhead Fusion";
export const GLOBAL_DESCRIPTION = "Creative AI web demo by PicCollage";

export const PAGES = [
  {
    category: "Image Enhancement",
    projects: [
      {
        title: "AI Image Expansion",
        icon: "ic:outline-photo-size-select-large",
        description:
          "Extend the boundaries of your images beyond their original capture.",
        route: "/ai-image-expansion",
        coverImage: "/cover-images/expand.jpeg",
        services: ["gen-ai-image-expansion"],
      },
      {
        title: "AI Image Upscale",
        icon: "ic:outline-aspect-ratio",
        description: "Enhance, de-noise, and upscale your images in seconds.",
        route: "/ai-image-upscale",
        coverImage: "/cover-images/upscale.jpeg",
        services: ["super-resolution-esrgan"],
      },
      {
        title: "Object Removal",
        icon: "ic:outline-aspect-ratio",
        description:
          "Easily select and remove unwanted objects from your images.",
        route: "/object-removal",
        coverImage: "/cover-images/eraser.jpeg",
        services: ["gen-ai-object-removal"],
      },
      {
        title: "Magic Replace",
        icon: "ic:sharp-switch-access-shortcut",
        description: "Easily replace objects in your images.",
        route: "/object-replacement",
        coverImage: "/cover-images/replace.jpeg",
        services: ["sdxl-magic-replace"],
      },
      {
        title: "Image Interpolation",
        icon: "ic:outline-auto-awesome-motion",
        description: "Upload two images and create magic transitions with AI",
        route: "/image-interpolation",
        coverImage: "/cover-images/interpolation.jpg",
        services: ["image-interpolation"],
      },
    ],
  },
  {
    category: "Portraits & Avatars",
    projects: [
      {
        title: "Magic Face",
        icon: "ic:outline-photo-size-select-large",
        description:
          "Create stylized avatars from portraits while preserving likeness.",
        route: "/magicface",
        coverImage: "/cover-images/magicface-dreamshaper.jpg",
        services: ["magicface-api-dreamshaper-xl-lightning-sfw"],
      },
      {
        title: "Magic Face Atomix",
        icon: "ic:outline-photo-size-select-large",
        description:
          "Create stylized avatars from portraits while preserving likeness.",
        route: "/magicface-atomix",
        coverImage: "/cover-images/magicface-atomix.jpg",
        services: ["magicface-api-atomix-anime-xl"],
      },
      {
        title: "AI Avatars",
        icon: "ic:outline-photo-size-select-large",
        description:
          "Create stylized avatars from portraits while preserving likeness.",
        route: "/ai-avatar",
        coverImage: "/cover-images/ai-avatar.jpeg",
        services: ["ai-avatar"],
      },
      {
        title: "AI Avatar Atomix",
        icon: "ic:outline-photo-size-select-large",
        description:
          "Create stylized avatars from portraits while preserving likeness.",
        route: "/ai-avatar-atomix",
        coverImage: "/cover-images/magicface-atomix.jpg",
        services: ["ai-avatar-atomix-anime-xl"],
      },
      {
        title: "Multi-face Avatars",
        icon: "ic:outline-people-alt",
        description:
          "Turn group photos into stylized artwork, maintaining likeness.",
        route: "/multiface-avatars",
        coverImage: "/cover-images/multiface.jpg",
        services: ["magicface-multiface"],
      },
      {
        title: "AI Panorama",
        icon: "ic:outline-panorama",
        description:
          "Combine multiple photos into one seamless panoramic image.",
        route: "/ai-panorama",
        coverImage: "/cover-images/panorama.jpeg",
        services: ["ai-panorama"],
      },
      {
        title: "AI Greeting Cards",
        icon: "ic:outline-card-giftcard",
        description: "Customize photos to match the styles of greeting cards.",
        route: "/ai-greeting-cards",
        coverImage: "/cover-images/greeting-cards.png",
        services: ["ai-avatar"],
      },
      {
        title: "AI Partial Style Transfer",
        icon: "ic:outline-style",
        description:
          "Transform segments or the entire photo into stylized artwork.",
        route: "/ai-style-transfer",
        coverImage: "/cover-images/style-transfer.jpg",
        services: ["style-transfer-explorer"],
      },
      {
        title: "AI Partial Style Transfer (SDXL)",
        icon: "ic:outline-style",
        description: "Stylize parts or all of a photo with a SDXL model.",
        route: "/ai-style-transfer-sdxl",
        coverImage: "/cover-images/style-transfer-sdxl.jpg",
        services: ["sdxl-style-transfer-with-magicface"],
      },
      {
        title: "Face Swap",
        icon: "ic:outline-people-alt",
        description:
          "Swap your face into any photo and become the star of the show.",
        route: "/face-swap",
        coverImage: "/cover-images/faceswap.jpg",
        services: [
          "super-resolution-esrgan",
          "face-swap-mememe",
          "face-analysis-mememe",
        ],
      },
    ],
  },
];

export const PAGES_BY_ROUTE = Object.fromEntries(
  PAGES.flatMap(({ category, projects }) =>
    projects.map((project) => [project.route, { ...project, category }])
  )
);

const constants = {
  GLOBAL_TITLE,
  GLOBAL_DESCRIPTION,
  PAGES,
  PAGES_BY_ROUTE,
};

export default constants;
