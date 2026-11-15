export type Project = {
  name: string;
  description: string;
  repo?: string;
  website?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    name: "Meridia",
    description: "Not a VSCode fork btw.",
    repo: "https://github.com/ridit-jangra/Meridia",
    website: "https://meridia.dev",
    image: "/meridia.png",
  },
  {
    name: "Ink",
    description: "One place to store, edit and view your stories!",
    repo: "https://github.com/ridit-jangra/Ink",
    website: "https://ink.ridit.space",
    image: "/ink.png",
  },
  {
    name: "Forge",
    description: "Git, but yours.",
    repo: "https://github.com/ridit-jangra/Ink",
  },
  {
    name: "Milo",
    description: "Milo is your cat buddy that codes with you, builds with you, ships with you and talks with you.",
    repo: "https://github.com/ridit-jangra/Milo",
    image: "/milo.png",
  },
  {
    name: "Relay",
    description: "One port. Any language. Monaco-ready LSP bridge.",
    repo: "https://github.com/ridit-jangra/Relay",
  },
  {
    name: "Dev",
    description: "One SDK, all CLIs.",
    repo: "https://github.com/ridit-jangra/dev",
  },
  {
    name: "Frame",
    description: "A pixel perfect ui library.",
    repo: "https://github.com/ridit-jangra/Frame",
    website: "https://frame.ridit.space",
  },
  {
    name: "Pixl",
    description: "A pixelated YSWS!",
    repo: "https://github.com/hackclub/pixl",
    website: "https://pixl.hackclub.com",
    image: "/pixl.png",
  },
  {
    name: "EcliSystems",
    description: "The frontend is written by me, someone else manages the backend. Eclisystems is a service to host your applications.",
    image: "/eclisystems-crop.png",
  },
  {
    name: "Echo",
    description: "Echo is jarvis :D. jarvis is echo :D",
    repo: "https://github.com/ridit-jangra/Echo",
  },
];
