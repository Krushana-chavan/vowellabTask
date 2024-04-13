import React, { useState, useRef, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { apiGET, apiPOST } from '../../utilities/apiHelpers';
import { toast } from 'react-toastify';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import InputComp from '../../components/Input/inputComp';
import InputCompforAddress from '../../components/Input/inputCompforAddress';
import { useDispatch, useSelector } from 'react-redux';

import OrderSummeryComp from '../../components/orderComponent/orderSummeryComp';
import { AiOutlinePlus } from "react-icons/ai";
import {loadStripe} from '@stripe/stripe-js';
const Checkout = () => {
	const [addressObj, setAddressObj] = useState();
	const [updateAddress, setUpdateAddress] = useState(false)
	const [orderId, setOrderId] = useState("");
	const [loading, setLoading] = useState(false);
	const [defaultDeliveryMethod, setDefaultDeliveryMethod] = useState({
		maindiv: "DTDC",
		subDiv: "We deliver your product very soon",
		price: 0
	})
	const [loadingStateofaddress, setLoadingStateofaddress] = useState(false)
	const [useDifferentAddress, setUseDifferentAddress] = useState(false)
	const handleAddnewAdddressToggle = () => {
		setFormData({
			firstName: '',
			lastName: '',
			phone: '',
			email: '',
			orderNotes: '',
			country: '',
			addressLine1: '',
			addressLine2: '',
			city: '',
			state: '',
			zip: '',
			isDefault: true,
			useDifferentAddress: false,
		})
		setAddressObj()
		setIsDropdownOpen(false)
		setUseDifferentAddress(false)
		setSelectedCountry('')
		setUpdateAddress(false)
		setNewAddress(true)
		setDefaultAddress(null)
	}


	const initialErrors = {
		firstName: '',
		lastName: '',
		phone: '',
		country: '',
		addressLine1: '',
		city: '',
		state: '',
		zip: '',

	};

	const [showAddressButton, setShowAddressButton] = useState(false)
	const { userData = null } = useSelector((state) => state.user);

	const makepayment = async() => {
		let data =	await creatOrder()
		const strip = await loadStripe("pk_test_51P42dwSIoo6YwzN49A7SFv2vOBVrarS24qMx87StYp4zo6offCHrIIeFa1hGalMs8akAqHrWUssvtYOL2q5PtPGN00s9BflGwn")
		 const body = {
			orderId:data,
		 }
		 const headers  = {
		  "Content-Type": "application/json",
		 }
	  
		 const response = await fetch("http://localhost:3001/v1/payment/payment-seesion",{
		  method:"POST",
		  headers:headers,
		  body:JSON.stringify(body),
		 })
		 const seession = await response.json();
	
		 const result = strip.redirectToCheckout({
		  sessionId:seession.id,
		 })
		 if(result.error){
		  console.log(result.error)
		 }
	  }

	const [addressArray, setAddressArray] = useState([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const handleOptionClick = (item) => {
		setIsDropdownOpen(false);
		getMyAddressById(item.id)
	};
	const [addNewAddress, setNewAddress] = useState(false)
	const [formErrors, setFormErrors] = useState({});
	const [defaultAddressCheck, setDefaultAddressCheck] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState('');
	const [myCartData, setMyCartData] = useState();
	const [subTotal, setSubTotal] = useState(0);
	const [totalPrice, setTotalPrice] = useState(0)
	const [isCustomerMethod, setCustomerMethod] = useState(true)
	const [isDeliveryMethodVisible, setDeliveryMethodVisible] = useState(false);
	const [totalAmountToPay, setTotalAmountToPay] = useState('');
	const [isPaymentMethodVisible, setPaymentMethodVisible] = useState(false)
	const [allAddresses, setAllAddresses] = useState([]);
	const [defaultAddress, setDefaultAddress] = useState(null);
	const [deliveryCharg, setDeliveryCharg] = useState(0);

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		phone: '',
		email: '',
		country: '',
		addressLine1: '',
		addressLine2: '',
		city: '',
		state: '',
		zip: '',
		isDefault: true,
		orderNotes: '',
		useDifferentAddress: false,
	});

	const validateForm = (payload) => {

		if (payload.firstName === undefined || payload?.firstName.trim() === '') {
			setFormErrors({ ...formErrors, firstName: "First name is required" })
			return false;
		}
		if (payload.lastName === undefined || payload.lastName.trim() === '') {
			setFormErrors({ ...formErrors, lastName: "Last name is required" })
			return false
		}
		if (payload.phone === '' || payload.phone === undefined) {
			setFormErrors({ ...formErrors, phone: "Phone Number is required" })
			return false
		}
		if (payload.email === '' || payload.email === undefined) {
			setFormErrors({ ...formErrors, email: "Email is required" })
			return false;
		}


		if (payload.email) {
			const validateEmail = (email) => {
				const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
				if (emailPattern.test(email)) {
					return true;
				} else {

					return false
				}
			};
			const validtedEmail = validateEmail(payload.email)
			if (!validtedEmail) {
				setFormErrors({ ...formErrors, email: "Email is invalid" })
				return false
			}
		}
		if (payload.country === '' || payload.country === undefined) {
			setFormErrors({ ...formErrors, country: "Country name is required" })
			return false;
		}
		if (payload.addressLine1 === '' || payload.addressLine1 === undefined) {
			setFormErrors({ ...formErrors, addressLine1: "addressLine1 is required" })
			return false;
		}
		if (payload.city === undefined || payload.city.trim() === '') {

			setFormErrors({ ...formErrors, city: "City is required" })
			return false;
		}
		if (payload.state === undefined || payload.state.trim() === '') {

			setFormErrors({ ...formErrors, state: "State is required" })
			return false;
		}
		if (payload.zip === '' || payload.zip === undefined) {

			setFormErrors({ ...formErrors, zip: "Zip is required" })
			return false;
		}
		return true;
	};

	const handleCustomerMethodVisible = () => {
		if (defaultAddress !== null) {
			setCustomerMethod(!isCustomerMethod)
			setDefaultAddressCheck(!isCustomerMethod)
			setFormData({
				...formData,
				firstName: defaultAddress?.firstName || '',
				lastName: defaultAddress?.lastName || '',
				phone: defaultAddress?.phone || '',
				orderNotes: defaultAddress?.orderNotes || '',
				country: defaultAddress?.country || '',
				addressLine1: defaultAddress?.addressLine1 || '',
				addressLine2: defaultAddress?.addressLine2 || '',
				city: defaultAddress?.city || '',
				email: defaultAddress?.email || '',
				state: defaultAddress?.state || '',
				zip: defaultAddress?.zip || '',
				isDefault: defaultAddress?.isDefault || false,
				useDifferentAddress: false,
			});
			setAddressObj({
				...addressObj,
				addressLine1: defaultAddress?.addressLine1 || '',
				addressLine2: defaultAddress?.addressLine2 || '',
				city: defaultAddress?.city || '',
				email: defaultAddress?.email || '',
				state: defaultAddress?.state || '',
				postCode: defaultAddress?.zip || '',

			})
		}
	}
	const handleChangeUpdate = () => {
		handleCustomerMethodVisible()
		setUpdateAddress(true)
	}

	const creatOrder = async () => {
		try {
			setLoading(true);
			let productDetail = []
			let totalAmount = 0;
			if (myCartData?.length) {
				for (let i = 0; i < myCartData.length; i++) {
					let currentProduct = myCartData[i];
					if (!currentProduct.hasOwnProperty("productDetail")) {
						console.log(currentProduct.productDetail[0]?.price)
						productDetail.push({
							productId: currentProduct?.productDetails[0]?._id,
							quantity: currentProduct?.quantity,
							
							price: currentProduct?.productDetails[0]?.price,
							productDetailsObj: currentProduct?.productDetails[0]
						})
					}
					else {
						productDetail.push({
							productId: currentProduct?.productDetails[0]?._id,
							quantity: currentProduct?.quantity,
							price: currentProduct?.productDetails[0]?.price,
							productDetailsObj: currentProduct?.productDetails[0],
							subProduct: currentProduct?.productDetail[0]?.subProduct
						})

					}
					totalAmount += currentProduct?.productDetails[0]?.price * currentProduct?.quantity;
				}
			}
			totalAmount += deliveryCharg;
			let payload = {
				productDetail,
				paymentMode: "online",
				paymentStatus: "unpaid",
				orderStatus: "unfulfilled",
				deliveryMethod:"DTDC",
				shippingAdderess: { shippingAddressId: defaultAddress?.id },
				deliveryCharge: deliveryCharg,
				amountToPay: Number(deliveryCharg) + Number(Number(totalAmountToPay).toFixed(2)),
				
			}
			const response = await apiPOST(`/v1/order/add-order`, payload);
			
			if (response?.data?.status) {
				setOrderId(response?.data?.data?.id)
				return(response?.data?.data?.id)

			} else {
				toast.error(response?.data?.data)
				//setPaymentMethodVisible(false)
			}
		} catch (e) {
			setLoading(false)


		}
	}
	const handleContinueClick = () => {
		if (myCartData?.length == 0) {
			toast.error("Your cart is empty")
			return
		}
	};
	const getMyCart = async () => {

		try {
			const response = await apiGET(`/v1/cart/get-my-cart`)
			console.log("response")
			
			if (response?.status === 200) {
				setMyCartData(response?.data?.data?.data);
				let carts = response?.data?.data?.data;
				let totalprice = 0;
				if (carts.length) {
					for (let i = 0; i < carts.length; i++) {
						totalprice += Number(carts[i]?.productDetails[0]?.price) * Number(carts[i]?.quantity)
					}
				}
				let subtotal = Number(totalprice.toFixed(2))
				
				setTotalPrice(subtotal.toFixed(2))
			} else {
				console.error("Error fetching Cart data:", response?.error);
			}
		} catch (error) {
			console.error("Error fetching collection data:", error);
		}

	}

	const initialzeDefaultAddress = (data) => {
		setFormData({
			...formData,
			firstName: data?.firstName || '',
			lastName: data?.lastName || '',
			phone: data?.phone || '',
			orderNotes: data?.orderNotes || '',
			country: data?.country || '',
			addressLine1: data?.addressLine1 || '',
			addressLine2: data?.addressLine2 || '',
			city: data?.city || '',
			state: data?.state || '',
			zip: data?.zip || '',
			email: data?.email || '',
			isDefault: false,
			useDifferentAddress: false,
		});
	}

	const handleDeliveryMethodClick = () => {
		if (defaultAddress !== null) {
			setCustomerMethod(true)
		}
	};
	const handlePaymentMethodClick = () => {
		if (defaultAddress !== null) setPaymentMethodVisible(!isPaymentMethodVisible)
		
	};
	const getMyAllAddress = async () => {
		try {
			const response = await apiGET(`/v1/address/get-my-address`)
			if (response?.data?.status) {
				setAllAddresses(response?.data?.data)
				let addr = response?.data?.data;
				if (addr.length > 0) {

					setSelectedCountry(addr[0]?.country)

					setDefaultAddressCheck(true)

					setDefaultAddress(addr[0])
					setAddressArray(addr)
					initialzeDefaultAddress(addr[0])
					setCustomerMethod(false)
					setDeliveryMethodVisible(true)


				} else if (addr.length === 1) {
					for (let i = 0; i < addr.length; i++) {
						setSelectedCountry(addr[i]?.country)
						setDefaultAddress(addr[i])
						initialzeDefaultAddress(addr[i])
						setCustomerMethod(false)
					}
				} else {
					setSelectedCountry("")
					setDefaultAddress(null)
					setDefaultAddressCheck(false)
					initialzeDefaultAddress(null)
				}
			}
		} catch (e) {
			console.log("Error to fetch address")
		}
	}
	const getMyAddressById = async (id) => {
		try {
			const response = await apiGET(`/v1/address/getAddress/${id}`)
			if (response?.data?.status) {

				setAllAddresses(response?.data?.data)
				let addr = response?.data?.data;

				if (addr) {
					setSelectedCountry(addr?.country)
					setDefaultAddressCheck(true)
					setDefaultAddress(addr)
					initialzeDefaultAddress(addr)
					setCustomerMethod(false)
					setDeliveryMethodVisible(true)

				}
			}

		} catch (e) {

			console.log("Error to fetch address")
		}
	}
	

	const updateAddressfunc = async () => {
		const payload = {
			firstName: formData?.firstName,
			lastName: formData?.lastName,
			phone: formData?.phone,
			orderNotes: formData?.orderNotes,
			country: formData?.country || selectedCountry,
			addressLine1: addressObj?.addressLine1 || addressObj?.addressLine1,
			city: addressObj?.city,
			state: addressObj?.state,
			zip: addressObj?.postCode,
			addressLine2: addressObj?.addressLine2,
			email: formData?.email,
			// isDefault: formData?.isDefault,
		}

		const flag = validateForm(payload)

		if (flag) {
			handleContinueClick()
			try {
				const response = await apiPOST(`/v1/address/update-address/${defaultAddress?.id}`, payload)

				if (response?.status === 200) {
					setDefaultAddress(response?.data?.data?.data)
					setDefaultAddressCheck(true)
					setDeliveryMethodVisible(true)


				} else {
					toast.error(response?.data?.message)

				}
			} catch (error) {
				toast.error(error.message)

			}
		} else {
			console.log('all fields required');
		}
	}
	const addAddress = async () => {
		
		
		const payload = {
			firstName: formData?.firstName,
			lastName: formData?.lastName,
			phone: formData?.phone,
			orderNotes: formData?.orderNotes,
			country: formData?.country || selectedCountry,
			addressLine1: addressObj?.addressLine1 || addressObj?.addressLine1,
			city: addressObj?.city,
			state: addressObj?.state,
			zip: addressObj?.postCode,
			addressLine2: addressObj?.addressLine2,
			email: formData?.email
			// isDefault: formData?.isDefault,
		}
		console.log(payload)
		const flag = validateForm(payload)
		console.log(flag)
	
		if (flag) {
			handleContinueClick()
			setLoadingStateofaddress(true)
			try {
				const response = await apiPOST(`/v1/address/add-address`, payload)
				if (response?.status === 200) {
					setDefaultAddress(response?.data?.data?.data)
					setDefaultAddressCheck(true)
					setDeliveryMethodVisible(true)


				} else {
					console.error("Error :", response?.data?.message);
				}
			} catch (error) {
				console.error("Error:", error);
			}
			finally {
				setLoadingStateofaddress(false)
			}
		} else {
			console.log('all fields required');
		}
	}

	const handleAddAddress = async () => {
		if (userData) {
			addAddress()
		} else {
			toast.error("Please login first")
		}
	}
	useEffect(() => {
		getMyAllAddress()
		getMyCart()
	}, [])

	useEffect(() => {
		setTotalPrice(Number(subTotal))
	}, [subTotal, deliveryCharg])


	const updateFormData = (name, value) => {
		setFormData({
			...formData,
			[name]: value,
		});
	};
	const clearFormErrors = () => {
		setFormErrors(initialErrors);
	};
	return (
		<div className="container">
			<div style={{ alignItems: "center", marginTop: "30px" }} className=' d-flex justify-content-between'>
				<Link to='/' className="text-decoration-none text-black">
					<div style={{ display: "flex", alignItems: "center", gap: '12px' }}>
						<img style={{ width: "55px" }}
							src={"https://www.vowelweb.com/wp-content/uploads/2022/06/vowelweb-logo.png"}
							alt="" />
						<p className='mb-0 fs-4'>CHECKOUT
							{/* {defaultAddress?.iso} */}
						</p>
					</div>
				</Link>
				<div className=' d-flex justify-content-end  fs-7 '><div><Link to="/" style={{ color: "black" }}>Continue Browsing</Link></div></div>
			</div>
			<hr />
			<div className="row" style={{ marginTop: "40px", }}>
				<div className="col-md-7" style={{ paddingRight: "25px" }}>

					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div>	<h4 className='popover-arrow' onClick={() => { handleCustomerMethodVisible() }}>Delivery Details</h4></div>
						{defaultAddressCheck && !useDifferentAddress ?
							<div className='cursor-pointer text-decoration-underline' onClick={() => { handleChangeUpdate() }}>
								Change
							</div>
							:
							""
						}
					</div>
					<div className={`d-${useDifferentAddress ? "block" : "none"}`}>
						<Form >
							<Form.Group controlId="country">
								<Form.Label >
									Choose an address
								</Form.Label> <br />
								<div className="custom-dropdown border border-black rounded-2 p-2" onClick={toggleDropdown}>
									<div className="selected-option d-flex justify-content-between ">
										<div>{'Select an address'} </div> <div>{isDropdownOpen ? <FaCaretUp /> : <FaCaretDown />}</div></div>

								</div>
								<div className=''>
									{isDropdownOpen && (
										<div className="dropdown-options border rounded-2 ">
											{addressArray.map((item, index) => (
												<div key={index} className="option bg-light mt-1 p-2 cursor-pointer" onClick={() => handleOptionClick(item)}>
													<div> <div>{item.addressLine1}</div>
														<div className='text-black-50 fs-6'>{item.zip}</div>
													</div>
												</div>
											))}
											<div className=' p-2 d-flex gap-2 align-items-center  cursor-pointer' onClick={() => {
												handleAddnewAdddressToggle();
											}
											}>
												<div className="fs-5"><AiOutlinePlus /> </div>
												<div className='fs-6  d-flex align-align-items-center '>Add New Address </div>
											</div>
										</div>
									)}
								</div>
							</Form.Group>
						</Form>
					</div>
					{defaultAddressCheck && defaultAddress ?
						<>
							<hr></hr>
							<div>
								<div className='d-flex justify-content-between'>
									<div> <span>{defaultAddress?.firstName}</span> <span>{defaultAddress?.lastName}</span></div>
									{useDifferentAddress ? <div className='text-decoration-underline me-2 cursor-pointer' onClick={() => {
										setUpdateAddress(true)
										setDefaultAddressCheck(false)
										setUseDifferentAddress(false)
									}}>Edit</div> : ""}
								</div>
								<div> {userData?.email}</div>
								<div> <span>{"  "}{defaultAddress?.addressLine1}</span>   <span>{"  "} {defaultAddress?.addressLine2}</span> <span> {"  "}{defaultAddress?.city}</span><span> {"  "}{defaultAddress?.zip},</span><span>{"  "}{defaultAddress?.country}</span> {" "}</div>
								<div> {defaultAddress?.phone}</div>
								<div><span>{defaultAddress?.orderNotes}</span></div>
							</div>
						</>
						:
						<div>
							<form>
								<div>
									<InputComp name="firstName" value={formData?.firstName} label="First Name" required="true" placeholder="" type="text" updateFormData={updateFormData} error={formErrors.firstName} clearErrors={clearFormErrors} />
								</div>
								<div>
									<InputComp name="lastName" value={formData?.lastName} label="Last Name" required="true" placeholder="" type="text" updateFormData={updateFormData} error={formErrors.lastName} clearErrors={clearFormErrors} />
								</div>
								<div>
									<InputComp name="phone" value={formData?.phone} label="Phone" required="true" placeholder="" type="numbers" updateFormData={updateFormData} error={formErrors.phone} clearErrors={clearFormErrors} />
								</div>
								<div>
									<InputComp name="email" value={formData?.email} label="Email" required="true" placeholder="" type="email" updateFormData={updateFormData} error={formErrors.email} clearErrors={clearFormErrors} />
								</div>
								<div>
									<InputComp name="country" value={formData?.country} label="Country" required="true" placeholder="" type="text" updateFormData={updateFormData} error={formErrors.country} clearErrors={clearFormErrors} />

								</div>
								<div>
									<InputCompforAddress onChange={(e) => setAddressObj({ ...addressObj, addressLine1: e.target.value })}
										name="addressLine1" label="Address - line 1" value={addressObj?.addressLine1 || formData?.addressLine1} placeholder="" type="text" updateFormData={updateFormData} clearErrors={clearFormErrors} />

								</div>
								<div>
									<InputCompforAddress onChange={(e) => setAddressObj({ ...addressObj, addressLine2: e.target.value })}
										name="addressLine2" label="Address - line 2" value={addressObj?.addressLine2 || formData?.addressLine2} placeholder="" type="text" updateFormData={updateFormData} clearErrors={clearFormErrors} />
								</div>
								<div>
									<InputCompforAddress name="city" label="City" onChange={(e) => setAddressObj({ ...addressObj, city: e.target.value })}
										value={addressObj?.city || formData?.city} required="true" placeholder="" type="text" updateFormData={updateFormData} error={formErrors.city} clearErrors={clearFormErrors} />
								</div>
								<div className='d-flex  ' style={{ width: '100%', gap: "20px" }}>
									<InputCompforAddress name="state" onChange={(e) => setAddressObj({ ...addressObj, state: e.target.value })}
										label="State" value={addressObj?.state || formData?.state} required="true" placeholder="" type="text" mainDivStyle={{ width: "50%" }} updateFormData={updateFormData} error={formErrors.state} clearErrors={clearFormErrors} />
									<InputCompforAddress name="zip" label="Zip / Postal code" value={addressObj?.postCode || formData?.zip} required="true" placeholder="" type="text" onChange={(e) => setAddressObj({ ...addressObj, postCode: e.target.value })}
										mainDivStyle={{ width: "50%" }} error={formErrors.zip} clearErrors={clearFormErrors} />
								</div>
								<div>
									<InputCompforAddress name="orderNotes" label="Order Note" onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
										value={addressObj?.orderNotes || formData?.orderNotes} placeholder="" type="text" updateFormData={updateFormData} error={formErrors.city} clearErrors={clearFormErrors} />
								</div>
								<div style={{ marginTop: "15px" }}>
									<input type="checkbox" id="makeDefault" checked={formData?.isDefault} onChange={addAddress} />
									<label for="html" style={{ marginLeft: "10px" }}>Save this address</label>
								</div>

								<div className='d-block d-lg-flex justify-content-between ' style={{ alignItems: "center", gap: "8px" }}>
									<Button onClick={updateAddress ? updateAddressfunc : handleAddAddress}
										type="button"
										variant="primary"
										className='w-100'
										style={{ backgroundColor: "black", marginTop: "15px", height: "45px" }}

									>
										{loadingStateofaddress ?
											<Spinner animation="border" style={{ color: "white", marginTop: 5 }} role="status">
												<span className="visually-hidden">Loading...</span>
											</Spinner> : null}
										{updateAddress ? "Update Address" : "Save & Continue"}
									</Button>
								</div>
							</form>
						</div>
					}
					<h4 style={{ marginTop: "40px" }} className={`${isCustomerMethod && defaultAddress == null ? 'opacity-50' : 'cursor-pointer'}`} onClick={handleDeliveryMethodClick}>Delivery method</h4>
					{defaultAddress?<div>
						<div className='d-flex justify-content-between'>
                            <div className='fs-5'>    {defaultDeliveryMethod?.maindiv} </div> <div className='fs-6'>₹ { defaultDeliveryMethod?.price }</div>
                        </div>
                        <div className='fs-6'> {defaultDeliveryMethod?.subDiv}</div>
					</div>:''}
					<hr />
					{showAddressButton && !isDeliveryMethodVisible ? <div>
						<div className='d-flex justify-content-between'><div className='fs-5'>	{defaultDeliveryMethod?.maindiv} </div> <div className='fs-6'>₹ {defaultDeliveryMethod?.price}</div></div>
						<div className='fs-6'> {defaultDeliveryMethod?.subDiv}</div>
					</div> : ""
					}
					<h3 style={{ marginTop: "40px", }} className={`${isCustomerMethod === true && defaultAddress == null ? 'opacity-50' : 'cursor-pointer'}`} onClick={handlePaymentMethodClick}>Payment</h3>
					{
						          isPaymentMethodVisible? <div>
								  <button onClick={()=>makepayment(123)}>Make Payment</button>
								</div>:""
					}
					<hr />
					<div style={{ marginBottom: `${!isPaymentMethodVisible ? '100px' : '0'}` }}></div>
				</div>
				<div className="col-md-5" style={{ padding: " 0 10px" }}>
					<OrderSummeryComp 
						myCartData={myCartData}
						subTotal={subTotal}
						deliveryCharg={deliveryCharg}
						totalPrice={totalPrice}
						selectedCountry={selectedCountry}
					
					/>
				</div>
			</div>
		</div>
	)
}
export default Checkout;
