import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { apiGET, apiPOST } from "../../utilities/apiHelpers";
import { useDispatch, useSelector } from "react-redux";
import { removeUser, setCartUpdate, setUser } from "../../redux/users/users";
import { FiChevronDown } from "react-icons/fi";
import { HiUserCircle } from "react-icons/hi";
import { IoIosNotifications, IoIosArrowForward } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { LuShoppingCart } from "react-icons/lu";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { BsSearch } from 'react-icons/bs';
import { MdClear } from 'react-icons/md'
import Signup from "../signup/signup";
import Login from "../signup/login";

import ModalCartItem from "./modalCartItem";
import {toast} from 'react-toastify'

const ProfileDropDown = () => {
	return (
		<div className=" p-0 m-0">
			{/* <HiUserCircle className="fs-3  " /> */}
			 <BiUser className="fs-3  " /> 
			
			{" "}
			<FiChevronDown className="nav-down-arrow fs-3" />
		</div>
	);
};
const ProfileDropDown1 = () => {
	return (
		<div className=" p-0 m-0">
			<HiUserCircle className="fs-3  text-white text-md-dark " />{" "}
			<FiChevronDown className="nav-down-arrow text-white text-md-dark fs-3" />
		</div>
	);
};
const Navbar = () => {

    
	const [mobileMenu, setMobileMenu] = useState(false);
	const [isUserLogin, setIsUserLogin] = useState(false);
	const [showSignup, setShowSignup] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const [MyCartData, setMyCartData] = useState([])
	const [MyCartItemsCount, setMyCartItemsCount] = useState(0)
	const [subTotal, setSubTotal] = useState(0)
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { userData } = useSelector((state) => state.user);
	const {cartupdate} =useSelector((s)=>s.user);
	const [serchInputClick, setserchInputClick] = useState(false)
	const [SearchKeyword, setSearchKeyword] = useState('');
	const [Products, setProducts] = useState([]);

	const Navigate = useNavigate()

	let navLinks = [
		{ link: "/", title: "Home" },
		{ link: "/shop", title: "Shop" },
		{ link: "/", title: "Search" },
		
		{ link: "/", title: "About Us" },
		{ link: "/", title: "Blog" },
	];
	//   const toggleDropdown = () => {
	//     console.log("hii");
	//     setShowDropdown(!showDropdown);
	//   };
	const handleShowSignup = () => {

		setShowLogin(false);
		setShowSignup(true);
	};
	const handleShowLogin = () => {
		setShowSignup(false);
		setShowLogin(true);
	}

	

	const handleCloseSignup = () => {
		setShowSignup(false);
	};
	const handleCloseLogin = () => {
		setShowLogin(false)
	}

	const closeDropdown = () => {
		setShowDropdown(false);
	};
	useEffect(() => {
		document.addEventListener("mousedown", closeDropdown, handleCloseSignup);
		return () => {
			document.removeEventListener("mousedown", closeDropdown, handleCloseSignup);
		};
	}, []);

	const checkHamburger = () => {
		let hamburgerCheckEle = document.getElementById("hamburgerCheck");
		if (hamburgerCheckEle.checked) {
			setMobileMenu(true);
		} else {
			setMobileMenu(false);
		}
	};


  const getMyCart = async () => {
  console.log("user Data in my cart------",userData)
		
  if ( userData != null) {

		try {
			const response = await apiGET(`/v1/cart/get-my-cart`)
             console.log("call to loggedin user",response)
			if (response?.status === 200) {

				setMyCartData(response?.data?.data?.data);
				setMyCartItemsCount(response?.data?.data?.totalItems)
				let carts = response?.data?.data?.data;
				let totalPrice = 0;
				if (carts.length) {
					for (let i = 0; i < carts.length; i++) {
						// console.log(carts[i]?.product)
						totalPrice += carts[i]?.productDetails[0]?.price * carts[i]?.quantity
						console.log(carts[i]?.productDetails[0]?.price, carts[i]?.quantity)
					}
				}
				setSubTotal(totalPrice.toFixed(2))
			} else {
				// toast.error(response?.data?.data)

				console.error("Error fetching Cart data:", response.data?.data);
			}

		} catch (error) {
			console.error("Error fetching collection data:", error);

		}
	}
	else{
	
	}
	}
	const getSerchProducts = async () => {
		try {
			const response = await apiGET(`/v1/products/get-searchproducts?keyWord=${SearchKeyword}`)
			if (response?.status === 200) {
				setProducts(response?.data?.data);
			} else {
				console.error("Error fetching collection data:", response.error);
			}
		} catch (error) {
			console.error("Error fetching collection data:", error);
		}
	}


	useEffect(() => {
		const interval = setInterval(() => {
			if (userData) getMyCart();
		}, 1000);

		if (userData) getMyCart();

		return () => {
			clearInterval(interval);
		};
	}, [SearchKeyword]);


	

	useEffect(()=>{
    getMyCart()
	},[cartupdate]);
	useEffect(()=>{
		getMyCart()
		},[]);

	useEffect(()=>{
	
			getMyCart()
		

	
		},[userData]);
	

	useEffect(() => {
		getSerchProducts()
	}, [SearchKeyword])






	const handleLogout = (e) => {
		dispatch(removeUser())
		localStorage.removeItem("accessToken")
		localStorage.removeItem("user")
	}
	let mobileMenuRef = useRef();
	const handleNavigat = (item) => {
		Navigate(`/product-page/${item?.name}`)
		setSearchKeyword('')
	}


	useEffect(() => {
		const checkIfClickedOutside = (e) => {
			if (
				mobileMenu &&
				mobileMenuRef.current &&
				serchInputClick &&
				!mobileMenuRef.current.contains(e.target)
			) {
				setMobileMenu(false);
			}
		};
		document.addEventListener("mousedown", checkIfClickedOutside);
		return () => {
			document.removeEventListener("mousedown", checkIfClickedOutside);
		};


	}, [mobileMenu]);


	return (
		<>
			<div class="offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
				<div class="offcanvas-header bg-dark">
					<h5 class="w-full text-center offcanvas-title text-white" id="staticBackdropLabel">
						<div className='row'>
							<div className='col-sm-6'>
								<IoIosArrowForward data-bs-dismiss="offcanvas" />
							</div>

							<div className='col-6 d-flex justify-content-center'>
								Cart
							</div>
						</div>
					</h5>
				</div>

				<div class="offcanvas-body">
					{MyCartData.length > 0 ?

						MyCartData.map((item, index) => (
							<ModalCartItem cartDetail={item} />
						)) : ""}

					{subTotal != 0 ?
						<div className="fs-3 mt-5">
							<p style={{ marginBottom: "0" }}>Subtotal</p>
							<p >£{subTotal}</p>
						</div>
						: ""}
				</div>
				<div class="offcanvas-footer">
					<div class="d-grid m-3">
						<Link to='/cart' className="w-100"> <button class="btn btn-dark  w-100" type="button" >View Cart</button> </Link>
					</div>
				</div>
			</div>



			<div>
			
				<div
					className="d-flex w-100 py-1 justify-content-center justify-content-md-between align-items-center bg-prime"
				>
					<div className="px-2 px-sm-5 px-md-2 px-lg-5 w-100 d-block h-100">
						<div className="d-flex w-100 justify-content-between">
							<Link to={"/"} className="text-decoration-none">
								<div className="text-white logo-shadow pb-2 fw-bold pricedown">vowelweb</div>
							</Link>
							<div className={`d-flex align-items-center justify-content-md-end gap-4 gap-md-0 gap-lg-4 `}>
								<div className={`d-none d-md-block  ${serchInputClick ? `navInput-2 expended  ` : ""} navInput navInput-1 py-2 px-2    `} onClick={() => setserchInputClick(!serchInputClick)} data-bs-toggle="dropdown" aria-expanded="false" style={{ height: "40px", position: "relative" }}>
									<div className="d-flex justify-content-between align-items-center" style={{marginTop:'-3px'}}>
										<input value={SearchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="Search" type={"text"} className=" border-0 outline-0  " style={{ background: "transparent", outline: "none", }} />
										<div className="d-flex justify-content-end">
											<div onClick={()=>setSearchKeyword('')}>
												{SearchKeyword?.length > 0 ?
													<span className="px-3">
														<MdClear size={16} color="black" />
													</span> : ''}
											</div>
											<div>
												<BsSearch size={16} color="black" />
											</div>
										</div>
									</div>
									<div className="dropdown-menu ">
										<div className="dropdown-item d-flex justify-content-start " style={{ fontSize: "14px" }}>Trending Products</div>
										{Products.map((item, i) => (<>

											<div onClick={() => handleNavigat(item)} key={i} className="dropdown-item d-flex justify-content-start">
												<div className="p-1">
													<img src={item?.productImageUrl} width={40} height={40}/>
												</div>
												<div className="px-4">
													<div className="p-0">{item?.name}	</div>
													<span className="p-0 opacity-50">Choose your favourite m...</span>
												</div>
											</div>
										</>))}
									</div>
								</div>
								{serchInputClick ||
									// <div className="d-inline-flex  " style={{position:'relative',marginLeft:'10px',marginRight:'10px'}}>										
									// 	<div style={{position:'absolute' , top: '-1rem', right:' 0rem', left: '-20px'}} className="text-uppercase " data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop">
									<div className="d-flex ms-2 relative  gap-1 ">										
										<div onClick={()=>{
											getMyCart()
										}} className="text-uppercase " data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop">
											<LuShoppingCart className="fs-3 ms-2" />
										</div>
										<div 
										// style={{position:'absolute',top:'-2.1rem'}} 
										className="bg-dark text-white px-2 d-flex align-items-center  rounded-pill ">
											{MyCartItemsCount}
										</div>
									</div>
								}
								<div className="d-none d-md-block ">
									<div></div>
									<div className="cursor-pointer ">
										{userData ? (
											<div className="d-flex align-item-center">
												{/* <button className="p-0 cursor-pointer custom-button mx-1 ">
													<IoIosNotifications className=" fs-3" />
												</button> */}
												<DropdownButton
													as={ButtonGroup}
													key={"SORT BY"}
													variant="Success"
													title={<ProfileDropDown />}
													className="custom-dropdown-button  d-flex justify-content-between p-0 "
													drop="down-centered"
												>
													<Dropdown.Item eventKey="1"><Link to="/ordersPage" className="text-decoration-none text-dark">My Orders</Link></Dropdown.Item>
													<Dropdown.Item eventKey="2"><Link to='/account/my-addresses' className="text-decoration-none text-dark">My Addresses </Link></Dropdown.Item>
													<Dropdown.Divider />
													<Dropdown.Item eventKey="" onClick={() => {
														dispatch(setCartUpdate(Math.floor(1000 + Math.random() * 9000)));
														handleLogout() }}>Log out</Dropdown.Item>


												</DropdownButton>

											</div>
										) : (
											<button
												className="d-flex cursor-pointer custom-button"
											// onClick={() => handleSubmit()}
											>
												<div className="fs-3 d-flex">
													<HiUserCircle />
												</div>
												<div
													className="d-flex align-item-center mx-2"
													onClick={handleShowSignup}
												>
													Login
												</div>
											</button>
										)}
									</div>
								</div>
								<div id="menuToggle border">
									<input
										id="hamburgerCheck"
										type="checkbox"
										checked={mobileMenu}
										onClick={checkHamburger}
									/>
									<label className="hamburgerToggle " for="hamburgerCheck">
										<div className="bar bar--top"></div>
										<div className="bar bar--middle"></div>
										<div className="bar bar--bottom"></div>
									</label>
								</div>
							</div>
						</div>
					</div>
					<div className="position-relative"></div>
					{mobileMenu ? (
						<div
							ref={mobileMenuRef}
							className={` text-white position-fixed p-4 mobileMenuToggle  ${mobileMenu
								? "d-flex flex-column end-0 top-0"
								: "d-none right-custom-menu"
								}  bg-dark gap-4`}
						>
							<div className="d-flex justify-content-between">
								<div> </div>
								<div className="d-md-none d-flex">
									{isUserLogin ? (
										<div className="d-flex align-item-center ms-5  ">
											<button className="p-0 cursor-pointer custom-button mx-1 text-white ">
												<IoIosNotifications className=" fs-3" />
											</button>
											<DropdownButton
												as={ButtonGroup}
												key={"SORT BY"}
												variant="Success"
												title={<ProfileDropDown1 />}
												className="custom-dropdown-button  d-flex justify-content-between p-0 "
												drop="down-centered"
											>
												<Dropdown.Item eventKey="1">My Orders</Dropdown.Item>
												<Dropdown.Item eventKey="2">My Addresses </Dropdown.Item>
											
											
												<Dropdown.Divider />
												<Dropdown.Item eventKey="">Log out</Dropdown.Item>

											</DropdownButton>
										</div>
									) : (
										<button
											className="d-flex cursor-pointer custom-button text-white ms-4"
										// onClick={() => handleSubmit()}
										>
											<div className="fs-3 d-flex ">
												<HiUserCircle />
											</div>
											<div className="d-flex align-item-center mx-2 ">Login</div>
										</button>
									)}
								</div>
								<div id="menuToggle">
									<input
										id="hamburgerCheck"
										type="checkbox"
										checked={mobileMenu}
										onClick={checkHamburger}
									/>
									<label className="hamburgerToggle" for="hamburgerCheck">
										<div
											className="bar bar--top"
											style={{ background: "white" }}
										></div>
										<div
											className="bar bar--middle"
											style={{ background: "white" }}
										></div>
										<div
											className="bar bar--bottom"
											style={{ background: "white" }}
										></div>
									</label>
								</div>
							</div>

							<div className="text-center fs-3 fw-bold ">Menu</div>
							{navLinks?.length
								? navLinks.map((item, index) => (
									<Link
										key={index}
										to={`${item?.link}`}
										className={`text-white fw-bold text-decoration-none ${item?.title === "Search" ? "d-md-none" : ""
											} `}
											onClick={()=>{setMobileMenu(false)}}
									>
										<div className="text-center"
											onClick={checkHamburger}
										>{item?.title}</div>
									</Link>
									
								))
								: ""}
						</div>
					) : (
						""
					)}
				</div>
				<Signup show={showSignup} handleClose={handleCloseSignup} handleShowLogin={handleShowLogin} />
				<Login show={showLogin} handleClose={handleCloseLogin} handleShowSignup={handleShowSignup}  />
			

			</div>



		</>
	)
}



export default Navbar;
