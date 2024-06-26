import type { Config } from "tailwindcss";
import {
    scopedPreflightStyles,
    isolateInsideOfContainer, // there are also isolateOutsideOfContainer and isolateForComponents
  } from 'tailwindcss-scoped-preflight';

export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    theme: {
        extend: {}
    },
    plugins: [require("@tailwindcss/typography"), 		scopedPreflightStyles({
        isolationStrategy: isolateInsideOfContainer('.twp'),
      })]
} as Config;