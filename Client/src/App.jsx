import React,{lazy, Suspense} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ProtectRoute from './components/Authentication/ProtectRoute'
import { LayoutLoader } from './components/Layout/Loaders'


const Home =lazy(() => import ("./pages/Home"))
const Login =lazy(() => import ("./pages/Login"))
const Chat =lazy(() => import ("./pages/Chat"))
const Groups =lazy(() => import ("./pages/Groups"))
const NotFound =lazy(() => import ("./pages/NotFound"))

let user=true;

function App() 
{
  return (
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
    </BrowserRouter>
  )
}

export default App