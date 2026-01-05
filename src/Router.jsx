import { createBrowserRouter } from "react-router-dom";
import SidebarLayout from "./components/SidebarLayout.jsx";
import Home from "./pages/home/index.jsx";
import SearchBar from "./components/websearch.jsx";


  const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <SidebarLayout />,
            children:[
              {
                path: "",
                element: <Home />
              },
              {
                path: "websearch",
                element: <SearchBar />
              }
            ]
        }
    ]
  );

  export default router;