import './App.css';
import NotFound from './pages/404NotFound';
import RegisterPage from './pages/auth/registerPage';
import LoginPage from './pages/auth/loginPage';
import Navbar from './componetns/Navbar';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
