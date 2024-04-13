import React from 'react';
import  { lazy, Suspense } from "react";
const Login = lazy(() =>import("../modules/login"));
const Dashboard =lazy(()=>import('../modules/dashboard'));
const Products =lazy(()=>import ('../modules/products'));
const Orders  = lazy(()=>import( '../modules/products/Orders'));
const UserList =lazy(()=>import( '../modules/users/listUsers'));

const authProtectedRoutes = [
	{ path: '', component: <Dashboard /> },
	{ path: 'all-products', component: <Products /> },
	{ path: 'all-products/:action', component: <Products /> },
	{ path: 'all-products/:action/:id', component: <Products /> },
	{ path: 'product-orders', component: < Orders /> },
	{ path: 'users', component: <UserList /> },

];

const publicRoutes = [
	{ path: '/login', component: <Login /> },
	{ path: '/', component: <Login /> },
];

export { authProtectedRoutes, publicRoutes };
