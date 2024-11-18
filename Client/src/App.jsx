import React,{lazy, Suspense, useEffect} from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import ProtectRoute from './components/Authentication/ProtectRoute';
import { LayoutLoader } from './components/Layout/Loaders';
import axios from "axios";
import { server } from './constants/config';
import { useDispatch, useSelector } from "react-redux"
import { userExists, userNotExists } from './redux/reducers/auth';
import { Toaster } from "react-hot-toast";


const Home =lazy(() => import ("./pages/Home"));
const Login =lazy(() => import ("./pages/Login"));
const Chat =lazy(() => import ("./pages/Chat"));
const Groups =lazy(() => import ("./pages/Groups"));
const NotFound =lazy(() => import ("./pages/NotFound"));

// let user=true;

function App() 
{

  const { user,loader } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  useEffect(()=>{
    axios.get(`${server}/api/v1/user/me`,{withCredentials:true})
    .then(({data}) => dispatch(userExists(data.user)))
    .catch((err) => dispatch(userNotExists()));
  },[dispatch])


  return loader ? <LayoutLoader/> : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader/>}>
          <Routes>

              {/* All Authenticated routes */}
              <Route element={<ProtectRoute user={user}/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/chat/:chatId" element={<Chat/>}/>
                    <Route path="/groups" element={<Groups/>}/>
              </Route>

              {/* Route for authentication */}
              <Route path="/login" element={<ProtectRoute user={!user} redirect="/">
                <Login/>
              </ProtectRoute>}/>

              {/* Route for page not found */}
              <Route path="*" element={<NotFound/>}/>


          </Routes>
      </Suspense>

      <Toaster position="bottom-center"/>
    </BrowserRouter>
  )
}

export default App