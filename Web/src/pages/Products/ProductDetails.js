import React, { useEffect, useState } from "react";
import { apiGET, apiPOST } from "../../utilities/apiHelpers";
import { useParams } from "react-router-dom";
import ReactHtmlParser from "html-react-parser";
import { Link, useNavigate } from "react-router-dom";
import {  toast } from "react-toastify";
import { setCartUpdate } from "../../redux/users/users";
import { useDispatch, useSelector } from "react-redux";

import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'



const ProductDetails = () => {
	const navigate = useNavigate();
	const [productDetails, setproductDetails] = useState(null);
	const [quantity, setQuentity] = useState(1);
	const [features, setFeatures] = useState("");
	const [desc, setDesc] = useState("");
	const dispatch = useDispatch();
	const { userData } = useSelector((s) => s.user);
	let param = useParams();
	const getAllProducts = async () => {
		try {
			const response = await apiGET(
				`/v1/products/getproduct-By-name/${param?.product}`
			);
			if (response?.status === 200) {
				let d = response?.data?.data
			
				const ulRegex = /<ul>(.*?)<\/ul>/gs; 
				const ulMatch = d.description.match(ulRegex);
				let f = ulMatch ? ulMatch[0] : ''; 
				const pRegex = /<p>(.*?)<\/p>/gs; 

				const pMatches = d.description.match(pRegex);
				let ds = pMatches ? pMatches.join('') : ''; 

				if (f.length > 0) setFeatures(f)
				if (ds.length > 0) setDesc(ds)
				setproductDetails(response?.data?.data);
			} else {
				console.error("Error fetching collection data:", response.error);
			}
		} catch (error) {
			console.error("Error fetching collection data:", error);
		}
	};
	const addToCart = async (product) => {
		if (productDetails?.inventory == 0) {
			toast.error("Product is out of stock ");
			return;
		}
		if (userData) {
			try {
				let payload = {
					productId: product,
					quantity: quantity
				};
				const response = await apiPOST("v1/cart/add-to-cart", payload);
				if (response?.status) {
					toast.success("Product added to cart");
					dispatch(setCartUpdate(Math.floor(1000 + Math.random() * 9000)));
				} else {
					toast.error(response?.data?.data?.msg);
				}
			} catch (error) {
				return false;
			}
		} else {
			toast.error("Please login first !")
			navigate("/")
		}
	};
	useEffect(() => {
		setFeatures("")
		setDesc("")
		getAllProducts();
	}, [param]);

	const handleQuantityChange = (e) => {
		const input = e.target.value;
		if (/^\d*$/.test(input)) {
			setQuentity(input)
		}
	};

	return (
		<div className="py-5 d-flex flex-column justify-content-center">
			<div className="container">
				<div className="d-flex flex-column flex-sm-row gap-3 justify-content-between align-items-center">
					<div className="w-100 d-flex justify-content-start">
						<Link to={'/'} className="text-dark text-decoration-none" >Home</Link>
						<span className="px-1">/</span>
						<Link to={'/shop'} className="text-dark text-decoration-none" >Shop</Link>
						<span className="px-1" >/</span>
						<Link to={'/'} className="text-dark text-decoration-none" style={{ opacity: "50%" }} disabled>{productDetails?.name}</Link>
					</div>
				</div>
				<div className="row py-5">
					<div className="col-12 col-sm-6 col-lg-5">
						<img
							src={productDetails?.productImageUrl}
							alt={productDetails?.name}
							className="w-100 p-5 p-sm-0"
						/>
					</div>
					<div className="col-12 col-sm-6 col-lg-4 p-4">
						<div className="fs-4">{productDetails?.name}</div>
						{productDetails?.originalPrice != productDetails?.price ? <div className="fs-5 mt-4 line-through-text">₹{(productDetails?.originalPrice)?.toFixed(2)}</div>:""}
					{	<div className={`fs-5 mt-${productDetails?.originalPrice != productDetails?.price ?"1":"4"}`}>₹{(productDetails?.price)?.toFixed(2)}</div>}
						<div className="mt-3">
							<p style={{ fontSize: "16px" }}>Quantity</p>
							<input
								style={{ width: "100px" }}
								className=" p-2"
								min={1}
								value={quantity}
								onChange={(e) => {
									handleQuantityChange(e)
								}}


							/>
							<span style={{ position: 'relative' }}><span onClick={() => { setQuentity(quantity + 1) }} style={{ position: 'absolute', right: '8px' }}><IoIosArrowUp style={{ color: 'gray' }} /> </span><span onClick={() => { if (quantity > 1) { setQuentity((quantity - 1)) } }} style={{ position: 'absolute', right: '8px', top: '6px' }}><IoIosArrowDown style={{ color: 'gray' }} /></span></span>
						</div>
						<div className="my-2">
							{(productDetails?.inventory == 0 || productDetails?.inventory.toLowerCase() == "out of stock")&& (
								<div>
									<span className="text-danger">Out of stock</span>
								</div>
							)}
							{productDetails?.inventory >= 1 &&
								productDetails?.inventory <= 10 && (
									<span className="text-success">
										Only {productDetails?.inventory} items left in stock
									</span>
								)}
						</div>
						{(productDetails?.inventory > 0 || productDetails?.inventory.toLowerCase() == "instock" ) && (
							<div className=" gap-2" style={{ display: 'flex', padding: "0 0px" }}>
								<button
									style={{ border: '1px solid black' }}
									className="bg-white p-2 col-sm-6 buttonDiv"
									onClick={() => {
										addToCart(productDetails?.id);
									}}
								>
									Add To Cart
								</button>
								<button
									onClick={() => {
										""
									}}
									style={{ minWidth: "50px", border: '1px solid black' }}
									className=" col-sm-2 p-2 bg-white"
								>
									 
										<svg
											viewBox="0 0 24 24"
											fill="currentColor"
											width="24"
											height="24"
											class="_1vD2j _2_JeV"
											data-hook="wishlist-button-icon"
										>
											<path
												fill-rule="evenodd"
												d="M8.1816,5.0039 C7.9276,5.0039 7.6696,5.0279 7.4106,5.0759 C5.7326,5.3909 4.3566,6.8479 4.0646,8.6189 C3.9346,9.4039 4.0036,10.2029 4.2616,10.9319 C4.2636,10.9379 4.2656,10.9439 4.2676,10.9499 C5.1716,13.8579 10.2066,17.4019 11.7286,18.4189 C11.8966,18.5329 12.1076,18.5309 12.2746,18.4189 C13.7956,17.4019 18.8266,13.8589 19.7326,10.9499 C19.9966,10.2029 20.0646,9.4039 19.9356,8.6189 C19.6426,6.8479 18.2666,5.3909 16.5896,5.0759 C14.9596,4.7749 13.3646,5.4459 12.4126,6.8369 C12.2256,7.1099 11.7736,7.1099 11.5876,6.8369 C10.7866,5.6669 9.5276,5.0039 8.1816,5.0039 M12.0016,19.5029 C11.7136,19.5029 11.4246,19.4189 11.1726,19.2509 C9.1366,17.8899 4.2966,14.3869 3.3156,11.2559 C3.0036,10.3719 2.9216,9.4039 3.0776,8.4569 C3.4436,6.2429 5.1106,4.4889 7.2266,4.0939 C9.0226,3.7539 10.8006,4.3809 11.9996,5.7409 C13.1996,4.3829 14.9766,3.7569 16.7736,4.0939 C18.8896,4.4899 20.5566,6.2429 20.9216,8.4569 C21.0786,9.4069 20.9956,10.3789 20.6816,11.2659 C19.7116,14.3819 14.8676,17.8889 12.8306,19.2509 C12.5786,19.4189 12.2896,19.5029 12.0016,19.5029"
											></path>
										</svg>
									
								</button>
							</div>
						)}
					
					</div>
					<div className="d-none d-lg-block col-3 p-4">
						{productDetails?.features ?
							ReactHtmlParser(productDetails.features)
							: features != "" ? ReactHtmlParser(features)
								: ""
						}
					</div>
				</div>
				<div>
					<div className="d-block d-lg-none">
						{productDetails?.features ?
							ReactHtmlParser(productDetails.features)
							: features != "" ? ReactHtmlParser(features)
								: ""
						}
					</div>
					{desc.length > 0 && desc !== null ?
						ReactHtmlParser(desc)
						: ""
					}
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
