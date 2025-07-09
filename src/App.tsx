import ThemeProvider from "@/providers/ThemeProvider";
import DateProvider from "@/providers/DateProvider";
import AddSchedule from "@/pages/AddSchedule";

function App() {
  return (
    <DateProvider>
      <ThemeProvider>
        <AddSchedule />
      </ThemeProvider>
    </DateProvider>
  );
}

export default App;
