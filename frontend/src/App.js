import { Navbar } from "./components/Navbar/Navbar";
import {createBrowserRouter } from "react-router-dom";
import Fish from "./components/Home/Fish";
import { AddNewFish } from "./components/AddNewFish/AddNewFish";
import { RouterProvider } from "react-router-dom";
import { AddCoustomer } from "./components/AddCoustomer/AddCoustomer";
import { Coustomer } from "./components/Coustomer/Coustomer";
import { CoustomerDetails } from "./components/CoustomerDetails/CoustomerDetails";
import { PayForm } from "./components/PayForm/PayForm";
import { Profile } from "./components/Profile/Profile";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import store from "./Redux/store";
import { Provider } from "react-redux";
import { PayOneForm } from "./components/PayForm/PayOneForm";
import ErrorPage from "./components/Error/ErrorPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const path = localStorage.getItem("Path")
console.log("In App", path)
function App() {
  const router = createBrowserRouter([
    {path: "/", element:<Navbar/>, errorElement: <ErrorPage/>,
      children:[
        {path: "/", element: <Fish/>},
        {path: "/addNewFish", element:  <AddNewFish/> },
        {path:"/AddCoustomer/:fishID", element: <AddCoustomer/>},
        {path:"/coustomer", element: <Coustomer/> },
        {path:"/toPay/:coustomerID", element: <PayForm/>  },
        {path:"/toPay/:coustomerID/:transactionID", element: <PayOneForm/>  },
        {path:"/login", element: <Login/>},
        {path:"/register", element: <Register/>},
        {path:"/details/:coustomerID", element:  <CoustomerDetails/> },
        {path:"/profile", element:  <Profile/>  }
      ]
    },
  ])
  // console.log("App")
  return (
    <Provider store={store}>
      {/* Write hare code */}
      <RouterProvider router={router}/>
    </Provider>
  )
}

export default App;
