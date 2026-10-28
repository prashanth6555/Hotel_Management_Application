import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { AppStateProvider } from "./context/AppState";
import Booking from "./pages/Booking";
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import Hotels from "./pages/Hotels";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/book/:hotelId/:roomId" element={<Booking />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AppStateProvider>
    </BrowserRouter>
  );
}
