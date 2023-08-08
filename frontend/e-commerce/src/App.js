import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Root from './Components/Root';
import Login from './Components/Login';
import CategoryList from "./Components/CategoryList";
import Home from './Components/Home';
import Logout from "./Components/Logout";
import Profile from "./Components/Profile";
import Register from "./Components/Register";
import ProductsList from "./Components/ProductsList";
import Cart from './Components/Cart';
import OrderDetails from "./Components/OrderDetails";
import styles from './Components/Styles/App.css';
import SearchList from "./Components/SearchList";
import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import {loadProfile} from './store/profileSlice';

function App() {
  const dispatch = useDispatch();

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' >
      <Route exact path="/" element={<Home />} />
      <Route path='/' element={ <Root /> } >
        <Route path='category' element={ <CategoryList/> } />
        <Route path='category/:categoryId/products' element={ <ProductsList/> } />
        <Route path='profile' element={ <Profile/> } />
        <Route path='cart' element={ <Cart/> } />
        <Route path='myOrders/:orderId' element={ <OrderDetails/> } />
        <Route path='search' element={ <SearchList/> } />
        <Route path='login' element={ <Login/> } />
        <Route path='register' element={ <Register/> } />
        <Route path='logout' element={ <Logout/> } />
      </Route>
    </Route>
  ));

  useEffect(() => {
    dispatch(loadProfile());
  }, []);

  return (
    <div className="App">
      <header className="App_header" >
        
      </header>
      <body className="App_body" >
        <RouterProvider router={ router } />
      </body>
    </div>
  );
}


export default App;
