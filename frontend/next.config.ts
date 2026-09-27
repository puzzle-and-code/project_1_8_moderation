import type { NextConfig } from "next";
import { withPigment } from "@pigment-css/nextjs-plugin";

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withPigment(nextConfig);

// import { withPigment } from "@pigment-css/nextjs-plugin";

// const nextConfig = {};

// export default withPigment(nextConfig, {
//   // Опциональная конфигурация Pigment CSS
//   theme: {
//     colors: {
//       primary: "#2563eb",
//       secondary: "#8b5cf6",
//     },
//   },
// });
