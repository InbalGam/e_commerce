import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Root from './Components/Root';
import Login from './Components/Login';
import CategoryList from "./Components/CategoryList";
import Home from './Components/Home';


function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' >
      <Route exact path="/" element={<Home />} />
      <Route path='/' element={ <Root /> } >
        <Route path='category' element={ <CategoryList/> } />
      </Route>
      <Route path='login' element={ <Login/> } />
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
