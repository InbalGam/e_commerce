import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Root from './Components/Root';
import Login from './Components/Login';
import CategoryList from "./Components/CategoryList";
import Home from './Components/Home';
import Logout from "./Components/Logout";
import Profile from "./Components/Profile";


function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' >
      <Route exact path="/" element={<Home />} />
      <Route path='/' element={ <Root /> } >
        <Route path='category' element={ <CategoryList/> } />
        <Route path='profile' element={ <Profile/> } />
      </Route>
      <Route path='login' element={ <Login/> } />
      <Route path='login' element={ <Logout/> } />
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
