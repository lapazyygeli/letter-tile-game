import { createBrowserRouter, redirect } from 'react-router'
import AppLayout from './features/AppLayout'
import { TestPage } from './features/test/TestPage'
import { HomePage } from './features/home/HomePage'
import { AuthLayout } from './features/auth/AuthLayout'
import { LoginPage } from './features/auth/login/LoginPage'
import { SignUpPage } from './features/auth/signup/SignUpPage'

// TODO: handle routes which don't match

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: HomePage },
      {
        path: 'auth',
        Component: AuthLayout,
        children: [
          { index: true, loader: () => redirect('/') },
          { path: 'login', Component: LoginPage },
          { path: 'signup', Component: SignUpPage },
        ],
      },
      {
        path: '/test',
        Component: TestPage,
      },
    ],
  },
])
