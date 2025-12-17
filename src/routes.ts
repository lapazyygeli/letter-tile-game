import { createBrowserRouter, redirect } from 'react-router'
import App from './App'
import { Test } from './pages/Test'
import { Home } from './pages/Home'
import { AuthLayout } from './pages/AuthLayout'
import { Login } from './components/Login'
import { SignUp } from './components/SignUp'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: Home },
      {
        path: 'auth',
        Component: AuthLayout,
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
