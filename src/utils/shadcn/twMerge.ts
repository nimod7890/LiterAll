import { fontSize } from "src/styles/theme/index.ts";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": Object.keys(fontSize).map(size => `text-${size}`),
    },
  },
});

export default twMerge;
