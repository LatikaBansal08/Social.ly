import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/register';
import Home from '../pages/home';
import LoadingPage from '../components/loading/loading';
import LoginOtp from '../pages/otp/loginOtp';
import VerifyOtp from '../pages/otp/verifyOtp';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../redux/actions/userActions';
import ProtectedRoute from './protectedRoute';
import AuthRoute from './authRoute';

const Path = () => {
  const [loading,setLoading] = useState(true);

  const dispatch = useDispatch();

  const { userLoading } = useSelector(state => state.userAuth);

  useEffect(() => {
    dispatch(loadUser());
    setTimeout(()=> {
      setLoading(false)
    },1000)
  }, [])


  return (
    <div>
      <Router>
        {
          loading || userLoading ? (
            <LoadingPage />
          ):(
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                 } />
                <Route path="/login" element={
                  <AuthRoute>
                    <Login />
                  </AuthRoute>
                  } />
                <Route path="/register" element={
                  <AuthRoute>
                    <Register />
                  </AuthRoute>
                  } />
                <Route path="login/:id" element={
                  <AuthRoute>
                    <LoginOtp />
                  </AuthRoute>
                  } />
                <Route path="verify/:id" element={
                  <AuthRoute>
                    <VerifyOtp/>
                  </AuthRoute>
                } />
              </Routes>
          )}
      </Router>
    </div>
  )
}

export default Path