import { createBrowserRouter, redirect } from 'react-router'
import App from './App'
import { Test } from './pages/Test'
import { Home } from './pages/Home'
import { Auth } from './pages/Auth'
import { Login } from './features/auth/Login'
import { SignUp } from './features/auth/SignUp'

// TODO: handle routes which don't match

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: Home },
      {
        path: 'auth',
        Component: Auth,
        children: [
          { index: true, loader: () => redirect('/') },
          { path: 'login', Component: Login },
          { path: 'signup', Component: SignUp },
        ],
      },
      {
        path: '/test',
        Component: Test,
      },
    ],
  },
])
