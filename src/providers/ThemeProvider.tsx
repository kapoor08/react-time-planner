import {
  ThemeProvider as MUIThemeProvider,
  THEME_ID,
  createTheme,
} from "@mui/material";

const muiTheme = createTheme({});

interface IProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: IProps) => {
  return (
    <MUIThemeProvider theme={{ [THEME_ID]: muiTheme }}>
      {children}
    </MUIThemeProvider>
  );
};

export default ThemeProvider;
