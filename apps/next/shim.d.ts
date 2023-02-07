// https://github.com/unocss/unocss/tree/main/packages/preset-attributify/

import type { AttributifyAttributes } from "@unocss/preset-attributify";

declare module "react" {
  interface HTMLAttributes<T> extends AttributifyAttributes {}
}
