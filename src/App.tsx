import { Route, Routes } from 'react-router-dom';

import './App.css';
import Navbar from './componetns/Navbar';
import NotFound from './pages/404NotFound';
import LoginPage from './pages/auth/loginPage';
import RegisterPage from './pages/auth/registerPage';
import MainPage from './pages/mainPage';
import ProfilePage from './pages/profilePage/ProfilePage';
import { routes } from './routes';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path={routes.HOME} element={<MainPage />} />
        <Route path={routes.REGISTER} element={<RegisterPage />} />
        <Route path={routes.LOGIN} element={<LoginPage />} />
        <Route path={routes.PROFILE} element={<ProfilePage />} />
        <Route path={routes.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
