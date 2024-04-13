import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { apiPOST } from "../../utilities/apiHelpers";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


const Card = ({ productDetail }) => {

	const { userData } = useSelector(s => s.user)
	const [showQuickView, setShowQuickView] = useState(false);
	const navigate = useNavigate()
	const addToCart = async (product) => {
		
		if (userData != null) {
			console.log(product);
			try {
				let payload = { productId: product }
				const response = await apiPOST('v1/cart/add-to-cart', payload)
				if (response?.data?.status) {
					// toast.success(response?.data?.data)
				} else {
					toast.error(response?.data?.data)
				}
			} catch (error) {
				return false
			}
		}

		else {
			toast.error("Please login first !")
			navigate("/")

		}
	}

	const handleMouseEnter = () => {
		setShowQuickView(true);
	};

	const handleMouseLeave = () => {
		setShowQuickView(false);
	};

	return (
		<div className="p-2"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			
		<Link to={`/product-page/${productDetail?.name}`}>
				<div className="card-container d-flex ">
					<img
						src={productDetail?.productImageUrl}
						className="img-fluid position-relative"
					/>
					<div className="quick-view position-absolute d-flex align-items-center justify-content-center" style={{ bottom: 0, width: "100%" }}>
					</div>
				</div>
			</Link>
			<div>
				<div style={{ fontSize: "16px", whiteSpace: "normal", wordBreak: "break-word" }}
					className="card-title avenir-semibold text-center mt-3 cursor-pointer" 
				>{productDetail?.name}</div>	
				{productDetail?.originalPrice != productDetail?.price ? <div class="card-text mt-2 text-center line-through-text">₹ {(productDetail?.originalPrice)?.toFixed(2)}</div>:""}
				<div class={`card-text mt-${productDetail?.originalPrice != productDetail?.price ? "1":"2"} text-center`}>₹ {(productDetail?.price)?.toFixed(2)}</div>
				<div className="d-flex justify-content-center mt-2" style={{ height: "40px" }}>
					{showQuickView && (
						<button type="button" class="bg-black text-white px-3" onClick={() => { addToCart(productDetail?._id) }} data-bs-toggle="offcanvas" data-bs-target="#Backdrop" >
							Add to Cart
						</button>	
					)}
				</div>
			</div>

		</div>
	);
};

export default Card;
