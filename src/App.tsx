import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch } from './redux/store';
import { checkTokenValidity } from './redux/auth/authSlice';

import './App.css';
import Navbar from './components/Navbar';
import NotFound from './pages/404NotFound';
import LoginPage from './pages/auth/loginPage';
import RegisterPage from './pages/auth/registerPage';
import FavoritesPage from './pages/favorites/FavoritesPage';
import MainPage from './pages/mainPage';
import ProfilePage from './pages/profilePage/ProfilePage';
import CreateVehiclePage from './pages/vehicles/CreateVehiclePage';
import EditVehiclePage from './pages/vehicles/EditVehiclePage';
import MyVehiclesPage from './pages/vehicles/MyVehiclesPage';
import VehicleDetailPage from './pages/vehicles/VehicleDetailPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';
import { routes } from './routes';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkTokenValidity());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path={routes.HOME} element={<MainPage />} />
        <Route path={routes.REGISTER} element={<RegisterPage />} />
        <Route path={routes.LOGIN} element={<LoginPage />} />
        <Route path={routes.PROFILE} element={<ProfilePage />} />
        <Route path={routes.VEHICLES} element={<VehiclesPage />} />
        <Route path={routes.VEHICLE_DETAIL} element={<VehicleDetailPage />} />
        <Route path={routes.VEHICLE_CREATE} element={<CreateVehiclePage />} />
        <Route path={routes.VEHICLE_EDIT} element={<EditVehiclePage />} />
        <Route path={routes.MY_VEHICLES} element={<MyVehiclesPage />} />
        <Route path={routes.FAVORITES} element={<FavoritesPage />} />
        <Route path={routes.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
