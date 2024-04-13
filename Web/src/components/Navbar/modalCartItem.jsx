import React, { useEffect, useState } from "react";
import { X } from "react-bootstrap-icons"
import { apiPOST } from "../../utilities/apiHelpers";
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";

const ModalCartItem = ({ cartDetail }) => {
	const { userData } = useSelector((state) => state.user);
	const [count, setCount] = useState(cartDetail?.quantity);

	useEffect(() => {
		setCount(cartDetail?.quantity)
	}, [cartDetail]);


	const addToCart = async (product) => {
		try {
			let payload = { productId: product }
			const response = await apiPOST('v1/cart/add-to-cart', payload)
			if (response?.data?.status) {
				// toast.success(response?.data?.data)
				// return true
			} else {
				toast.error(response?.data?.data)
				return false
			}
		} catch (error) {
			return false
		}
	}
	

	const removeFromCart = async (product) => {
		try {
			let payload = { productId: product }
			const response = await apiPOST('v1/cart/remove-from-cart', payload)
			if (response?.data?.code) {
				// return true
			} else {
				return false
			}
		} catch (error) {
			return false
		}
	}
	
	

	function increment() {
		setCount(function (prevCount) {
			const res = userData? addToCart(cartDetail?.productId): toast.error("Please Login first!");
			if (res) {
				return (prevCount += 1);
			} else {
				alert("getting error while  adding to cart")
			}

		});
	}

	function decrement() {
		setCount(function (prevCount) {
			const res = userData? removeFromCart(cartDetail?.productId): toast.error("Please login to continue")
			if (prevCount > 0) {
				if (res) {
					return (prevCount -= 1);
				} else {
					alert("getting error while removing to cart")
				}


			} else {
				return (prevCount = 0);
			}
		});
	}

	const removeCart = async () => {
		try {
			let payload = { productId: cartDetail?.productId }
			console.log(payload)
			const response = await apiPOST('v1/cart/remove-cart', payload)
			if (response?.data?.code) {
				toast.success('Cart Item Removed Successfully')
				console.log(response)

			} else {
				alert("Error while Product removing!")
			}
		} catch (error) {

		}
	}



	return (
		<>
		<div>
			<div onClick={() => {
				console.log("cart details---------", cartDetail)
			}} className='d-flex  justify-content-between m-2 mt-5 ' >
				<div><img src={cartDetail?.productDetails[0]?.productImageUrl} height={100} width={100} /></div>
				<div style={{ width: "200px", }}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>{cartDetail?.productDetails[0]?.name}
						<div className='col-2 col-lg-3'>
							<div className='w-100 d-flex justify-content-end fs-4 cursor-pointer '><X onClick={userData? removeCart:toast.fire("Please login to continue")} /></div>
						</div>
					</div>

					<div className="mt-2">₹{cartDetail?.productDetails[0]?.price}</div>

					{!cartDetail?.productDetail[0]?.subProduct?
					<div className='border  border-black d-flex justify-content-between mt-2' style={{ width: "70px" }}>
						<div onClick={decrement} className=' text-center mx-2 cursor-pointer '>-</div>
						<div className='text-center'>{count}</div>
						<div onClick={increment} className=' text-center mx-2 cursor-pointer'>+</div>
					</div>:null}

				
				</div>
				
			</div>
			{cartDetail?.productDetail[0]?.subProduct?
			<p>Products:</p>:null}
			{cartDetail?.productDetail[0]?.subProduct.map((item, index) => (
                     	<div onClick={() => {
							console.log("cart details---------", cartDetail)
						}} className='d-flex  justify-content-between m-2 mt-2 ' >
							<div><img src={item?.productDetailsObj?.productImageUrl} height={100} width={100} /></div>
							<div style={{ width: "200px" ,}}>
								<div style={{display:'flex', justifyContent:'space-between'}}>{item?.productDetailsObj?.name}
								<div className='col-2 col-lg-3'>
								
								</div>
								</div>
			
								<div className="mt-2">Quantity {item?.quantity}</div>
			
			
								
			
							
							</div>
							
						</div>   
                            ))}
							<hr/>

</div>
		</>
	)
}



export default ModalCartItem;
