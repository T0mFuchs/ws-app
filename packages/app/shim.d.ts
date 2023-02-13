// https://github.com/unocss/unocss/tree/main/packages/preset-attributify/

import type { AttributifyAttributes } from "@unocss/preset-attributify";

declare module "react" {
  // @ts-ignore
  interface HTMLAttributes extends AttributifyAttributes {
    // all the classes (as props) that typescript still complains about
    grid?: boolean | string;
    flex?: boolean | string;
    rounded?: boolean;
  }
}
