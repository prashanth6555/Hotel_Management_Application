import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppState";
import { buildStaySearch, toQuery } from "../utils/search";

export function useGoToStays() {
  const navigate = useNavigate();
  const { search, setSearch } = useAppState();

  return (overrides = {}, options = {}) => {
    const next = buildStaySearch(search, overrides, options);
    setSearch(next);
    navigate(`/hotels?${toQuery(next)}`);
  };
}

export function useOpenDestination() {
  const goToStays = useGoToStays();
  return (city) => goToStays({ location: city }, { fillDates: true });
}
