import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';

import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { MessageFloatingButton } from './components/messages';
import NotFound from './pages/404NotFound';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import PasswordResetConfirmPage from './pages/auth/PasswordResetConfirmPage';
import LoginPage from './pages/auth/loginPage';
import RegisterPage from './pages/auth/registerPage';
import CarDetailsPage from './pages/cars/CarDetailsPage';
import CreateListingPage from './pages/cars/CreateListingPage';
import FavoritesPage from './pages/favorites/FavoritesPage';
import MainPage from './pages/mainPage';
import { MessagesPage } from './pages/messages';
import ProfilePage from './pages/profilePage/ProfilePage';
import EditVehiclePage from './pages/vehicles/EditVehiclePage';
import MyVehiclesPage from './pages/vehicles/MyVehiclesPage';
import VehicleDetailPage from './pages/vehicles/VehicleDetailPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';
import { checkTokenValidity } from './redux/auth/authSlice';
import { type RootState, useAppDispatch } from './redux/store';
import { routes } from './routes';

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    dispatch(checkTokenValidity());
  }, [dispatch]);

  const showFloatingButton =
    user &&
    !location.pathname.includes('/login') &&
    !location.pathname.includes('/register') &&
    !location.pathname.includes('/messages');

  const hideNavbar =
    location.pathname.includes('/login') ||
    location.pathname.includes('/register') ||
    location.pathname.includes('/forgot-password') ||
    location.pathname.includes('/reset-password');

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path={routes.HOME} element={<MainPage />} />
        <Route path={routes.LOGIN} element={<LoginPage />} />
        <Route path={routes.REGISTER} element={<RegisterPage />} />
        <Route path={routes.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={routes.RESET_PASSWORD} element={<PasswordResetConfirmPage />} />
        <Route path={routes.CAR_DETAILS} element={<CarDetailsPage />} />

        <Route path={routes.PROFILE} element={<ProfilePage />} />
        <Route path={routes.VEHICLES} element={<VehiclesPage />} />
        <Route path={routes.VEHICLE_DETAIL} element={<VehicleDetailPage />} />
        <Route path={routes.VEHICLE_CREATE} element={<CreateListingPage />} />
        <Route path={routes.VEHICLE_EDIT} element={<EditVehiclePage />} />
        <Route path={routes.MY_VEHICLES} element={<MyVehiclesPage />} />
        <Route path={routes.FAVORITES} element={<FavoritesPage />} />
        <Route path={routes.MESSAGES} element={<MessagesPage />} />
        <Route path={routes.MESSAGE_CONVERSATION} element={<MessagesPage />} />
        <Route path={routes.NOT_FOUND} element={<NotFound />} />
      </Routes>
      {!hideNavbar && <Footer />}
      {showFloatingButton && <MessageFloatingButton />}
    </>
  );
}

export default App;
