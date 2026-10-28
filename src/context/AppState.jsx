import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  BOOKINGS_KEY,
  SEARCH_KEY,
  loadBookings,
  loadSearch,
  writeStorage,
} from "../utils/storage";

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [search, setSearchState] = useState(loadSearch);
  const [bookings, setBookings] = useState(loadBookings);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message) => {
    setToast({ message, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const setSearch = useCallback((next) => {
    setSearchState((previous) => {
      const value = typeof next === "function" ? next(previous) : next;
      writeStorage(SEARCH_KEY, value);
      return value;
    });
  }, []);

  const addBooking = useCallback((booking) => {
    setBookings((previous) => {
      const next = [booking, ...previous];
      writeStorage(BOOKINGS_KEY, next);
      return next;
    });
  }, []);

  const cancelBooking = useCallback(
    (id) => {
      setBookings((previous) => {
        const next = previous.map((booking) =>
          booking.id === id
            ? { ...booking, status: "cancelled", cancelledAt: new Date().toISOString() }
            : booking,
        );
        writeStorage(BOOKINGS_KEY, next);
        return next;
      });
      notify("Booking cancelled");
    },
    [notify],
  );

  useEffect(() => {
    function onStorage(event) {
      if (event.key === BOOKINGS_KEY) setBookings(loadBookings());
      if (event.key === SEARCH_KEY) setSearchState(loadSearch());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({ search, setSearch, bookings, addBooking, cancelBooking, toast, notify }),
    [search, setSearch, bookings, addBooking, cancelBooking, toast, notify],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return value;
}
