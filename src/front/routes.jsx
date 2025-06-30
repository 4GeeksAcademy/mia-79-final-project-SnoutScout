// Import necessary components and functions from react-router-dom.

import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Messages } from "./pages/Messages";
import FindYourPup from "./pages/FindYourPup";
import Home from "./pages/Home";
import Question1 from "./pages/Question1";
import Question2 from "./pages/Question2";
import Question3 from "./pages/Question3";
import Question4 from "./pages/Question4";
import Question5 from "./pages/Question5";
import Question6 from "./pages/Question6";
import Question7 from "./pages/Question7";
import Question8 from "./pages/Question8";

// import { Single } from "./pages/Single";
// import { Demo } from "./pages/Demo";


export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
   
      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route index element={<Home />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/question1" element={<Question1 />} />
      <Route path="/question2" element={<Question2 />} />
      <Route path="/question3" element={<Question3 />} />
      <Route path="/question4" element={<Question4 />} />
      <Route path="/question5" element={<Question5 />} />
      <Route path="/question6" element={<Question6 />} />
      <Route path="/question7" element={<Question7 />} />
      <Route path="/question8" element={<Question8 />} />
       <Route path="find-your-pup" element={<FindYourPup />} />




      {/* Dynamic route for single items */}
      {/* <Route path="/demo" element={<Demo />} /> */}
      
    </Route>
  )
);