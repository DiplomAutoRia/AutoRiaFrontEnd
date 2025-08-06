import { Route, Routes } from 'react-router-dom';

import './App.css';
import Navbar from './componetns/Navbar';
import NotFound from './pages/404NotFound';
import LoginPage from './pages/auth/loginPage';
import RegisterPage from './pages/auth/registerPage';
import MainPage from './pages/mainPage';
import ProfilePage from './pages/profilePage/ProfilePage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import { routes } from './routes';
import CreateListingPage from './pages/cars/CreateListingPage';
import EditListingPage from './pages/cars/EditListingPage';
import CarDetailsPage from './pages/cars/CarDetailsPage';
import MyListingsPage from './pages/profilePage/MyListingsPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path={routes.HOME} element={<MainPage />} />
        <Route path={routes.LOGIN} element={<LoginPage />} />
        <Route path={routes.REGISTER} element={<RegisterPage />} />
        <Route path={routes.CAR_DETAILS} element={<CarDetailsPage />} />
        

        <Route path={routes.PROFILE} element={<ProfilePage />} />
        <Route path={routes.MY_LISTINGS} element={<MyListingsPage />} />
        <Route path={routes.CREATE} element={<CreateListingPage />} />
        <Route path={routes.EDIT_LISTING} element={<EditListingPage />} />
        <Route path={routes.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={routes.RESET_PASSWORD} element={<ResetPasswordPage />} />
        

        <Route path={routes.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
