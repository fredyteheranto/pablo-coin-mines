const components = {
  MuiCssBaseline: {
    styleOverrides: {
      "*": {
        boxSizing: "border-box",
      },
      html: {
        height: "100%",
        width: "100%",
      },
      body: {
        height: "100%",
        margin: 0,
        padding: 0,
        color: "#fff !important",
        backgroundColor: "#141a2a",
      },
      "#root": {
        height: "100%",
        color: "#fff !important",
      },
    },
  },
  MuiContainer: {
    styleOverrides: {
      root: {
        marginTop: 32,
        paddingLeft: "15px !important",
        paddingRight: "15px !important",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        padding: "32px 32px",
        background: "#1d263b",
        borderRadius: 24,
        overflow: "hidden",
        color: "#a6acb8",
        boxShadow: "0px 7px 30px 0px rgba(90, 114, 123, 0.11)",
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: "rgb(255 255 255 / 12%)",
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        color: "#a6acb8",
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: "#2cc4c4",
        },
        "&.Mui-hoover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#fff",
        },
      },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: {
        color: "#a6acb8",
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        color: "#a6acb8",
      },
    },
  },
};

export default components;
