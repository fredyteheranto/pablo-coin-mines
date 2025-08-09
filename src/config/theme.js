import { createTheme } from "@mui/material";
import components from "./components";

export default createTheme({
    palette: {
        primary: {
            dark: "#1e8989",
            main: '#2cc4c4',
            light: "#56cfcf",
        },
        secondary: {
            dark: "#0f33b2",
            main: '#1649ff',
            light: '#446dff',
            contrastText: '#fff',
        },
    },
    components
});