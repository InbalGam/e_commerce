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

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' >
      <Route exact path="/" element={<Home />} />
      <Route path='/' element={ <Root /> } >
        <Route path='category' element={ <CategoryList/> } />
        <Route path='category/:categoryId/products' element={ <ProductsList/> } />
        <Route path='profile' element={ <Profile/> } />
        <Route path='cart' element={ <Cart/> } />
      </Route>
      <Route path='login' element={ <Login/> } />
      <Route path='register' element={ <Register/> } />
      <Route path='logout' element={ <Logout/> } />
    </Route>
  ));

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
