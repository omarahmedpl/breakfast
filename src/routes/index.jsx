import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import DefaultLayout from "../Layouts/DefaultLayout";
import Home from "../pages/Home";
import Restaurants from "../pages/Restaurants/Restaurants";
import Orders from "../pages/Orders/Orders";
import Items from "../pages/Items/Items";
import AllRestaurants from "../pages/Restaurants/AllRestaurants";
import AllOrders from "../pages/Orders/AllOrder";
import OrderInfo from "../pages/Orders/OrderInfo";
import AllItems from "../pages/Items/AllItems";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<DefaultLayout />}>
      <Route index element={<Home />} />
      <Route path="restaurants" element={<Restaurants />} />
      <Route path="restaurants/all" element={<AllRestaurants />} />
      <Route path="orders" element={<Orders />} />
      <Route path="orders/details/:order_id" element={<OrderInfo />} />
      <Route path="orders/all" element={<AllOrders />} />
      <Route path="items" element={<Items />} />
      <Route path="items/all" element={<AllItems />} />
    </Route>
  )
);

export default router;
