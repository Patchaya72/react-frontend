import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home";  // Corrected the import
import TotalDataPage from "./pages/totaldata";

const router = createBrowserRouter([
  { path: "/home", element: <HomePage /> },  // Corrected the typo here as well
  { path: "/totalData", element: <TotalDataPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

