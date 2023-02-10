export type Page = {
  _id?: string;
  name?: string;
  desc?: string;
  clr?: string;
  tags?: [PageTag];
  content?: [PageContent];
  iat?: number;
  eat?: number;
};

export type PageTag = {
  _id?: string;
  name?: string;
  clr?: string;
};

export type PageContent = {
  _id?: string;
  style?: keyof typeof contentStyles;
  value?: string;
};

const contentStyles = {
  // default style
  d: "p-1",
  // heading,
  h1: "text-2xl font-bold",
  h2: "text-xl font-bold",
  h3: "text-lg font-bold",
  // text,
  b: "bold",
} as const;
