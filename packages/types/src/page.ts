export type Page = {
  i?: number;
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
  i?: number;
  _id?: string;
  name?: string;
  clr?: string;
};

export type PageContent = {
  i?: number;
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
