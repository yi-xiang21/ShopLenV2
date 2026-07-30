
import './App.css'
import AppInit from './app/init/AppInit'
import { RouterProvider } from 'react-router-dom';
import { routes } from './app/router/Route';
import { store } from './app/redux/store';
import { Provider } from 'react-redux';
function App() {
  return (
    <Provider store={store}>
    <AppInit>
      <RouterProvider router={routes} />
    </AppInit>
    </Provider>
  )
}
  
export default App
