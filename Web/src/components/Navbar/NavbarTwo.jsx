import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { apiGET, apiPOST } from "../../utilities/apiHelpers";
import { useDispatch, useSelector } from "react-redux";
import { removeUser, setCartUpdate, setUser } from "../../redux/users/users";
import { FiChevronDown, FiShoppingCart } from "react-icons/fi";
import { HiUserCircle } from "react-icons/hi";
import { IoIosNotifications, IoIosArrowForward } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { LuShoppingCart } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import { GrClose } from "react-icons/gr";

import { BsSearch } from 'react-icons/bs';
import { MdClear } from 'react-icons/md'
import Signup from "../signup/signup";
import Login from "../signup/login";
import ModalCartItem from "./modalCartItem";
import login from '../../assets/login.svg'
import loginWhite from '../../assets/login-white.svg'

import { toast } from 'react-toastify'

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
const NavbarTwo = () => {


    const [avatarDropdown, setAvatarDropdown] = useState(false);
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
    const { cartupdate } = useSelector((s) => s.user);
    const [SearchKeyword, setSearchKeyword] = useState('');
    const [searchInputVisible, setSearchInputVisible] = useState(false);
    const toggleSearchInput = () => {
        setSearchInputVisible(!searchInputVisible);
    };

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
    }, [SearchKeyword]);

  

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
    const handleNavigat = (item) => {
        Navigate(`/product-page/${item?.name}`)
        setSearchKeyword('')
    }


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


    const [currentText, setCurrentText] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentText((prevText) => (prevText === 2 ? 0 : prevText + 1));
        }, 2500); // Change text every 2 seconds

        return () => clearInterval(interval);
    }, []);

 



    return (
        <>
            {/* <div  class="offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel"> */}

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
                        <img src={"https://www.vowelweb.com/wp-content/uploads/2022/06/vowelweb-logo.png"} alt="logo-sidebar" className="logo-sidebar" ></img>
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
                                <p >£{subTotal}</p>
                            </div>
                            : ""}
                        <Link to='/cart' className="w-100"> <button data-bs-dismiss="offcanvas" class="btn btn-dark  w-100" type="button" style={{ borderRadius: '0' }} >View Cart</button> </Link>
                    </div>
                </div>
            </div>

        



            <div>
                <div className=" shadow-lg  py-lg-1">
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
                            <div className={`d-flex gap-3 align-items-center gap-sm-4`} style={{ height: "42px" }}>
                                <div className="justify-content-center cursor-pointer d-flex align-items-center ">
                                 
                                    <BsSearch
                                        className="text-dark"
                                        onClick={toggleSearchInput}
                                        style={{ fontSize: '26px' }}
                                    />

                                </div>
                                <div
                                    onClick={() => {
                                        getMyCart()
                                    }}
                                    data-bs-toggle="offcanvas" data-bs-target="#Backdrop"
                                    className=" cursor-pointer align-items-center d-flex "
                                >
                                    {MyCartItemsCount ?
                                        <div className="position-relative  cursor-pointer align-items-center d-flex ">
                                            <FiShoppingCart style={{ fontSize: '28px' }} />
                                            <span
                                                style={{ fontWeight: 'bolder', height: "12px", width: '12px', top: "0px", left: '19.5px', border: '1px solid white', backgroundColor: '#4df75c', borderRadius: '100px' }}
                                                className={`position-absolute justify-content-center d-flex align-items-center boder-none anton"  `}>
                                            </span>

                                        </div>
                                        :
                                        <FiShoppingCart style={{ fontSize: '28px' }} />}

                                </div>
                                {userData ?
                                    <div class="dropdown d-none d-lg-block " style={{marginLeft:"-12px"}}>
                                        <button class="btn btn-transparent dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            <BiUser
                                                className="fs-3"
                                            />
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            
                                            <li>
                                                <Link to='/account/my-addresses' className={`d-block dropdown-item text-decoration-none text-dark`}>My Addresses </Link>
                                            </li>
                       
                                            <li>
                                                <button
                                                    className="dropdown-item"
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
                                 
                                        <img onClick={handleShowSignup} className="cursor-pointer" src={login} alt="login" style={{ width: '31px', height: '37px' }}></img>
                                
                                }
                                <div className="justify-content-center cursor-pointer d-flex  d-lg-none align-items-center">
                                    <RxHamburgerMenu
                                        onClick={() => {
                                            setMobileMenu(!mobileMenu)
                                        }}
                                        className="fs-2"
                                    />
                                </div>
                            </div>
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
                                                <Link to='/account/my-addresses' className={`d-block dropdown-item text-decoration-none text-black`}>My Addresses </Link>
                                            </li>
                                            <li>
                                                <Link to='/account' className={`d-block dropdown-item text-decoration-none text-black`}>My Account</Link>
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
                <Login show={showLogin} handleClose={handleCloseLogin} handleShowSignup={handleShowSignup}  />
              
            </div>
        </>
    )
}



export default NavbarTwo;
