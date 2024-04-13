import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { apiGET } from "../../utilities/apiHelpers";
import { useDispatch, useSelector } from "react-redux";
import { removeUser, setCartUpdate, setUser } from "../../redux/users/users";
import {  FiShoppingCart } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";

import Signup from "../signup/signup";
import Login from "../signup/login";
import ForgetPassword from "../signup/forgetPassword";
import ModalCartItem from "./modalCartItem";
import logo from '../../assets/logo.svg'
import login from '../../assets/login.svg'
import loginWhite from '../../assets/login-white.svg'

const NavbarTwo = () => {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showForgetPassword, setShowForgetPassword] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [MyCartData, setMyCartData] = useState([])
    const [MyCartItemsCount, setMyCartItemsCount] = useState(0)
    const [subTotal, setSubTotal] = useState(0)
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
    const { cartupdate } = useSelector((s) => s.user);
   
    const Navigate = useNavigate()

    let navLinks = [
        { link: "/", title: "Home" },
        { link: "/shop", title: "Shop" },
        { link: "/", title: "Wholesale" },
        { link: "/", title: "About Us" },
        { link: "/", title: "Blog" },
  
    ];

    const handleShowSignup = () => {
        setShowLogin(false);
        setShowSignup(true);
    };
    const handleShowLogin = () => {
        setShowSignup(false);
        setShowLogin(true);
    }

    const handelShowForgetPassword = () => {
        setShowSignup(false);
        setShowLogin(false);
        setShowForgetPassword(true);
    }

    const handleCloseSignup = () => {
        setShowSignup(false);
    };
    const handleCloseLogin = () => {
        setShowLogin(false)
    }

    const handleCloseForgetPassword = () => {
        setShowForgetPassword(false)
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


    const getMyCart = async () => {
        if (userData != null) {
            try {
                const response = await apiGET(`/v1/cart/get-my-cart`)
                if (response?.status === 200) {

                    setMyCartData(response?.data?.data?.data);
                    setMyCartItemsCount(response?.data?.data?.totalItems)
                    let carts = response?.data?.data?.data;
                    let totalPrice = 0;
                    if (carts.length) {
                        for (let i = 0; i < carts.length; i++) {
                            totalPrice += carts[i]?.productDetails[0]?.price * carts[i]?.quantity
                        }
                    }
                    setSubTotal(totalPrice.toFixed(2))
                } else {
                    console.error("Error fetching Cart data:", response.data?.data);
                }

            } catch (error) {
                console.error("Error fetching collection data:", error);
            }
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
    }, []);

  

    useEffect(() => {
        getMyCart()
    }, [cartupdate]);
    useEffect(() => {
        getMyCart()
    }, []);

    useEffect(() => {
        getMyCart()
    }, [userData]);


    const handleLogout = (e) => {
        dispatch(removeUser())
        localStorage.removeItem("accessToken")
        localStorage.removeItem("user")
        Navigate("/");
        window.location.reload();
    }

    let mobileMenuRef = useRef();
   

    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            if (mobileMenu && !mobileMenuRef.current.contains(e.target)) {
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
            <div class="offcanvas offcanvas-end" data-bs-dismiss="offcanvas" data-bs-scroll="true" tabindex="-1" id="Backdrop" aria-labelledby="BackdropLabel" >
                <div class="offcanvas-header " style={{ backgroundColor: '#0396FF' }}>
                    <h5 class="w-full text-center offcanvas-title text-white fw-bold" id="BackdropLabel">
                        <div className='row ' >
                            <div className=' d-flex  gap-3'>
                                <div >
                                    <IoIosArrowForward data-bs-dismiss="offcanvas" />
                                </div>
                                <div className='d-flex justify-content-center'>
                                    Cart
                                </div>
                            </div>
                        </div>
                    </h5>
                    <div>
                        <img src={logo} alt="logo-sidebar" className="logo-sidebar" ></img>
                    </div>
                </div>

                <div class="offcanvas-body">
                    {MyCartData.length > 0 ?
                        MyCartData.map((item, index) => (
                            <ModalCartItem cartDetail={item} />
                        )) : ""}

                </div>
                <div class="offcanvas-footer">
                    <div class="d-grid m-3">
                        {subTotal != 0 ?
                            <div className="fs-3 mt-2">
                                <p style={{ marginBottom: "0" }}>Subtotal</p>
                                <p >₹{subTotal}</p>
                            </div>
                            : ""}
                        <Link to='/cart' className="w-100"> <button data-bs-dismiss="offcanvas" class="btn btn-dark  w-100" type="button" style={{ borderRadius: '0' }} >View Cart</button> </Link>
                    </div>
                </div>
            </div>
            <div>
                <div className=" shadow-sm py-lg-1">
                    <div className="px-3 px-sm-5">
                        <div className=" d-flex w-100 justify-content-between align-items-center py-1">
                            <Link to={"/"} className="text-decoration-none">
                                <div className="pb-2 pt-2 "> <img src={"https://www.vowelweb.com/wp-content/uploads/2022/06/vowelweb-logo.png"} alt="logo-vowelweb" className="logo-size" /> </div>
                            </Link>
                            {navLinks?.length ?
                                <div className="d-none d-lg-flex gap-3 gap-xl-4 ">
                                    {navLinks.map((item, index) => (
                                        <Link
                                            style={{ fontWeight: "600" }}
                                            key={index}
                                            to={`${item?.link}`}
                                            // className={`text-dark text-decoration-none ${item.title == 'Home' ? 'd-none' : ''}`}
                                            className={`text-dark text-decoration-none`}
                                        >
                                            <div className="">{item?.title}</div>
                                        </Link>
                                    ))}
                                </div>
                                : ""
                            }
                        </div>
                    </div>
                </div>
                <div className="">
                    {mobileMenu ?
                        <div
                            ref={mobileMenuRef}
                            className={` d-flex flex-column d-lg-none position-fixed bg-white gap-4 p-4`}
                            style={{ top: "0px", right: "0px", zIndex: "100", maxWidth: "300px", width: "100%", height: "100vh" ,backgroundColor:'white'}}
                        >
                            <div className="d-flex  " style={{ justifyContent: 'space-between', alignItems: 'center', marginLeft: '28px' }}>
                                <div></div>
                                {userData ?
                                    <div className="dropdown d-flex justify-content-center  " style={{ color: 'black', border: '1px solid black', borderRadius: '10px' }}>
                                        <button class="btn btn-transparent dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'black' }}>
                                            <BiUser
                                                className="fs-3 text-black"
                                            />
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            <li>
                                                <Link to="/ordersPage" className={`d-block dropdown-item text-decoration-none text-black`}>My Orders</Link>
                                            </li>
                                            <li>
                                                <Link to='/account/my-addresses' className={`d-block dropdown-item text-decoration-none text-black`}>My Addresses </Link>
                                            </li>
                                          
                                            <li>
                                                <button
                                                    className="dropdown-item text-black"
                                                    onClick={() => {
                                                        dispatch(setCartUpdate(Math.floor(1000 + Math.random() * 9000)));
                                                        handleLogout()
                                                    }}
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    :
                                    <button className="text-white d-flex justify-content-center cursor-pointer custom-button">
                                        <div
                                            className="d-flex align-item-center"
                                            onClick={handleShowSignup}
                                        >
                                            <img src={loginWhite} alt="login" style={{ width: '31px', height: '34px' }}></img>
                                        </div>
                                    </button>
                                }

                                <svg
                                    className="cursor-pointer "
                                    onClick={() => { setMobileMenu(false) }}
                                    stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" class="fs-3" >
                                    <path fill="none" stroke="#000" stroke-width="3" d="M3,3 L21,21 M3,21 L21,3"></path></svg>
                            </div>
                            <div className="text-center fs-3 text-black">
                                Menu
                            </div>
                            
                            {navLinks?.length ?
                                <div className="d-flex justify-content-center align-items-center flex-column gap-3 gap-xl-4 ">
                                    {navLinks.map((item, index) => (
                                        <Link
                                            style={{ fontWeight: "600" }}
                                            key={index}
                                            to={`${item?.link}`}
                                            onClick={() => {
                                                setMobileMenu(false)
                                            }}
                                            className={`text-black text-decoration-none `}
                                        >
                                            <div className="">{item?.title}</div>
                                        </Link>
                                    ))}
                                </div>
                                : ""
                            }


                        </div>
                        : ""
                    }
                </div>
                <Signup show={showSignup} handleClose={handleCloseSignup} handleShowLogin={handleShowLogin} />
                <Login show={showLogin} handleClose={handleCloseLogin} handleShowSignup={handleShowSignup} handelShowForgetPassword={handelShowForgetPassword} />
                <ForgetPassword show={showForgetPassword} handleClose={handleCloseForgetPassword} />
            </div>
        </>
    )
}



export default NavbarTwo;
