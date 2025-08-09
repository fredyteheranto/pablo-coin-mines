module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      50: "#fff0f0",
      100: "#ffdddd",
      200: "#ffc1c1",
      300: "#ff9696",
      400: "#ff5a5a",
      500: "#ff2727",
      600: "#fb0707",
      700: "#e20101",
      800: "#af0505",
      900: "#900c0c",
      950: "#4f0000"
    }
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#1d4ed8",

          secondary: "#e20101",

          accent: "#1fb2a6",

          neutral: "#0b0e13",

          "base-100": "#0b0e13",

          info: "#3abff8",

          success: "#36d399",

          warning: "#fbbd23",

          error: "#f87272"
        }
      },
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter"
    ]
  }
};
