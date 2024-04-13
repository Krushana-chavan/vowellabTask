import React from "react";
import  { lazy, Suspense } from "react";
import { Spinner } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const HomePage = lazy(() =>import("../pages/Home/HomePage"));
const ProductPage = React.lazy(() => import('../pages/Products/ProductsPage'));
const ProductDetails = React.lazy(() => import('../pages/Products/ProductDetails'));
const Footer = React.lazy(() => import('../components/Footer/Footer'));
const MyCart = React.lazy(() => import('../pages/cart/mycart'));
const MyAddresses = React.lazy(() => import('../pages/My-Profile/MyAddresses'));
const Checkout = React.lazy(() => import('../pages/Checkout/checkout'))
const thankyou = React.lazy(() => import('../pages/Thankyou/thankyou'));
const NavbarTwo = React.lazy(() => import('../components/Navbar/NavbarTwo'));
const SearchProductResults = React.lazy(()=> import('../pages/Products/searchProductResults'))
export const publicPages = [
  { path: "/", exact: true, component: HomePage },
  { path: "/shop", component: ProductPage },
  { path: "/product-page/:product", component: ProductDetails },
  { path: "/cart", component: MyCart },
  {path: '/account/my-addresses' , component:MyAddresses},
  { path: "/checkout", component: Checkout },
  {path: "/checkout/thankyou/:orderId", component:thankyou},
  {path:'/search-results', component:SearchProductResults},
];
export const withoutfooterandNavbar = [
  { path: "/checkout", component: Checkout },
]


const SiteRoutes = () => {
  return (
    <BrowserRouter basename="/">
		<Suspense
          fallback={
            <div style={{display:"flex",height:"100vh",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <Spinner animation="border" style={{ color: "black", marginTop: 5 }} role="status">
										<span className="visually-hidden">Loading...</span>
									</Spinner>
            </div>
          }
        >
	
		  <Routes>
			{publicPages.map((route, idx) => (
			  <Route
				key={idx}
				path={`${route?.path}`}
				element={
				  withoutfooterandNavbar.find((item) => item.path === route?.path)
					? <route.component />
					: (
					  <>
						<NavbarTwo />
						<route.component />
						<Footer />
					  </>
					)
				}
			  />
			))}
		  </Routes>
		  </Suspense>
	
	  </BrowserRouter>
  );
};

export default SiteRoutes;