export const LIST_OF_COLOURS = [
  "#0290D7",
  "#4D4D4D",
  "#999999",
  "#F44E3B",
  "#FE9200",
  "#FCDC00",
  "#DBDF00",
];

export const toolbarModules = {
  listsAndIndents: [
    { list: "ordered" },
    { list: "bullet" },
    { indent: "-1" },
    { indent: "+1" },
  ],
  characterFormats: [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
  ],
  colors: [
    { color: [...LIST_OF_COLOURS] },
    { background: [...LIST_OF_COLOURS] },
  ],
  media: ["link", "image", "video"],
};

export const formatsSettings = {
  listsAndIndents: ["list", "bullet", "indent"],
  characterFormats: [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "align",
  ],
  colors: ["color", "background"],
  media: ["link", "image", "video"],
};

export const formats = [
  ...formatsSettings.characterFormats,
  ...formatsSettings.colors,
  ...formatsSettings.listsAndIndents,
  ...formatsSettings.media,
];

export const modules = {
  toolbar: [
    toolbarModules.characterFormats,
    toolbarModules.colors,
    toolbarModules.listsAndIndents,
    toolbarModules.media,
    
  
  ],
  clipboard: { matchVisual: false },
  history: {
    delay: 2000,
    maxStack: 100,
    userOnly: true,
  },
};
