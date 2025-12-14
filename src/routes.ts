import { createBrowserRouter } from 'react-router'
import App from './App'
import { TestPage } from './components/TestPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  {
    path: '/test',
    Component: TestPage,
  },
])
