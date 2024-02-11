import { useAppDispatch, useAppSelector } from "@/hooks";
import { changeTheme } from "@/redux/features/themes-slice";
import "@/styles/ui/themeToggle.scss";

export function ThemeToggle() {
  const theme = useAppSelector((state) => state.themesSlice.theme);
  const dispatch = useAppDispatch();

  if (theme === "dark") {
    return (
      <button
        className="light"
        onClick={(e) => {
          e.preventDefault();
          dispatch(changeTheme("light"));
        }}
      >
        Light Mode
      </button>
    );
  }

  if (theme === "light") {
    return (
      <button
        className="dark"
        onClick={(e) => {
          e.preventDefault();
          dispatch(changeTheme("dark"));
        }}
      >
        Dark Mode
      </button>
    );
  }
}
