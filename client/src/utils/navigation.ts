import { NavigateFunction, Location } from "react-router-dom";

export function scrollToSectionOrNavigateHome(
  sectionId: string,
  location: Location,
  navigate: NavigateFunction,
  setMobileMenuOpen?: (open: boolean) => void
) {
  if (location.pathname !== "/") {
    navigate("/", { state: { scrollTo: sectionId } });
    setMobileMenuOpen?.(false);
  } else {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen?.(false);
    }
  }
}
