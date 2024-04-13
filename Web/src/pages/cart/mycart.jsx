import React, { useEffect, useState } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { X, LockFill, Tag, Paperclip } from "react-bootstrap-icons"
import CartItem from '../../components/cart/cartItem'
import { apiGET, apiPOST } from '../../utilities/apiHelpers';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert2'

const MyCart = () => {
    const navigate = useNavigate()



    const [displayPromocode, setDisplayPromocode] = useState(false)
    const [displaynote, setDisplaynote] = useState(false)
    const [subTotal, setSubTotal] = useState(0)
    const [MyCartData, setMyCartData] = useState([])
    const [accessToken, setAccessToken] = useState()
    const { userData } = useSelector((state) => state.user);

    const getAccess = () => {
        const storedAccessToken = localStorage.getItem('accessToken');
        if (storedAccessToken) {
            setAccessToken(storedAccessToken);
        }
    }

    const checkProductsAvailable = async () => {
        navigate('/checkout')
        // if (!userData) {
        //     swal.fire({
        //         title: "Login Required",
        //         text: "Please login to check out the product",
        //         icon: "warning",
        //     });
        //     navigate('/')
        //     return
        // }
        // try {
        //     const response = await apiGET(`/v1/cart/check-products-available`)

        //     if (response?.status === 200) {
              
        //     } else {
        //         toast.error(response?.data?.data)
        //     }
        // } catch (error) {
        //     console.error("Error fetching collection data:", error);

        // }
    }
    const checkProductsAvailable1 = async () => {
        if (!userData) {
            return
        }
        try {
            const response = await apiGET(`/v1/cart/check-products-available`)

            if (response?.status === 200) {

            } else {
                toast.error(response?.data?.data)
            }
        } catch (error) {
            console.error("Error fetching collection data:", error);

        }
    }


    const getMyCart = async () => {
        // if(!userData){
        // 	return
        // }

        if (userData != null) {
            try {
                const response = await apiGET(`/v1/cart/get-my-cart`)

                if (response?.status === 200) {

                    setMyCartData(response?.data?.data?.data);
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
                    console.error("Error fetching Cart data:", response.error);
                }

            } catch (error) {
                console.error("Error fetching collection data:", error);

            }
        } else {
            try {
                let paylod = {
                    deviceId: localStorage.getItem("deviceId")
                }
                const response = await apiPOST(`/v1/cart/nouser-get-my-cart`, paylod)

                if (response?.status === 200) {

                    setMyCartData(response?.data?.data?.data);
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
                    console.error("Error fetching Cart data:", response.error);
                }

            } catch (error) {
                console.error("Error fetching collection data:", error);

            }

        }



    }



    useEffect(() => {
        const interval = setInterval(() => {
            if (userData) getMyCart();
        }, 2000);

        if (userData) getMyCart();

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        // checkProductsAvailable1()
        getMyCart()
        getAccess()
    }, []);




    return (
        <div className='container py-2 py-sm-5 px-5'>
            {MyCartData[0] ? <div>
                <div className='mt-0 mb-5 content-hidden4'>
                    <Link to='/checkout' ><button type="button" class="btn btn-dark rounded-0 w-100">Checkout</button></Link>
                </div>
                <div className='row'>
                    <div className='col-12 col-md-7'>
                        <div className=''>My cart</div>

                        {MyCartData.length > 0 ?

                            MyCartData.map((item, index) => (
                                <CartItem cartDetail={item} getMyCart={getMyCart}/>
                            )) : ""}
                    </div>



                    <div className='col'></div>
                    <div className='col-md-4 col-12  p-3 '>
                        <div className='border-bottom pb-3 content-hidden3  '>Order summary</div>
                        <div className='content-hidden4'>
                            <div className='text-decoration-underline border-bottom pb-2 mt-4'>
                                <span className='d-flex gap-2 pb-2 mt-4  ' onClick={() => { setDisplayPromocode(!displayPromocode) }}> <div><Tag /></div> <div>Enter a promo code</div> </span>
                                <div className={` d-${displayPromocode ? "block" : "none"} l-sm-12 col-lg-6 col-md-8 `} >
                                    <input type="text" className='py-2 p-2 w-75' placeholder='Enter promo code' />
                                    <button type="submit " className='bg-transparent py-2 w-25 '>Apply</button>
                                </div>
                            </div>
                            <div className='text-decoration-underline border-bottom pb-2 mt-4'>
                                <span className=' gap-2 row' onClick={() => { setDisplaynote(!displaynote) }}> <div className='d-flex gap-2  '><div><Paperclip /></div> <div>Add note</div></div> </span>
                                <div className={`py-3 d-${displaynote ? "block" : "none"} col-sm-12 col-lg-6 col-md-8`} >
                                    <textarea type="text-area" className='py-6 rounded-0 p-2 w-100 ' placeholder='Instruction? Special requests? Add them here.' />
                                </div>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col'>Subtotal</div>
                            <div className='col d-flex justify-content-end'>
                                ₹{subTotal}
                            </div>
                        </div>
                        <div className='mt-3 text-decoration-underline border-bottom pb-2 '>
                            Estimate Delivery
                        </div>
                        <div className='row mt-3'>
                            <div className='col'>Total</div>
                            <div className='col d-flex justify-content-end'>
                                ₹{subTotal}
                            </div>
                        </div>
                        <div className='mt-3'>
                            {/* <Link to='/checkout' > */}
                            <button type="button"
                                onClick={() => {
                                    checkProductsAvailable()
                                }}
                                className="btn btn-dark rounded-0 w-100">
                                Checkout
                            </button>
                            {/* </Link> */}
                        </div>
                        <div>

                            <div className='text-center mt-3'>
                                <LockFill /> Secure Checkout
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
                : <div className='w-100 h-50 ' >
                    <div className='fs-4 fw-lighter'>My cart</div>
                    <div className=' border-top mt-3 pb-5' ></div>
                    <div className='align-content-center text-center  col-12'>
                        <div className='mt-5 fs-4'> Cart is empty  </div>
                        <div> <Link className='text-black text-decoration-underline fs-5  fw-light' to="/">Continue Browsing</Link></div>
                    </div>
                    <div className=' border-bottom mt-5 pb-5'> </div>
                </div>}
        </div>
    )
}

export default MyCart