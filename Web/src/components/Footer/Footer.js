import React from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';

const Footer = () => {
	return (
		<div className=" container-fluid bg-dark text-white d-flex justify-content-center  p-sm-5">
			<div className="w-75">
				<div className="d-flex justify-content-center row">
					<div className=" col-6 col-sm-6  col-md-3  ">
						<ul className=" list-unstyled  p-2  d-flex flex-column">
							<Link to="/shop" className='text-decoration-none '>Shop</Link>
							<Link to="/" className='text-decoration-none pt-2'>Blog</Link>
							<Link to="/" className='text-decoration-none pt-2'>About Us</Link>


						</ul>
					</div>
					<div className="  col-6 col-sm-6  col-md-3 ">
						<ul className=" list-unstyled p-2 d-flex flex-column text-nowrap">
							<Link to="/" className='text-decoration-none '>FAQ</Link>
							<Link to="/"className='text-decoration-none pt-2 '>Terms of service</Link>
							<Link to="/" className='text-decoration-none pt-2'>Privacy policy</Link>
							<Link to="/" className='text-decoration-none pt-2'>Medical Disclaimer </Link>

						</ul>
					</div>
					<div className="col-12 col-md-6 row    p-2  justify-content-md-end d-flex justify-content-center"   style={{marginLeft:"-20px"}}>
						<div className=" col-12 col-md-6    ">
							<label className='text-center w-100 text-md-start text-nowrap'>Subscribe here! *</label>
							<input style={{ borderTop: "none", borderRight: "none", borderLeft: "none", outline: "none", color: "white" }} type="email " className="w-100  p-1 border-white    bg-dark outline border-right-0 " ></input>
							<p className='text-center text-md-start' style={{fontSize:"12px",lineHeight:"18px"}}>subscribe to our mail list for monthly discounts and offers	</p>
						</div>
						<div className="mt-4  col-md-6 d-flex justify-content-center justify-content-md-start   col-12 " style={{ marginLeft: "12px" }}>
							<button className="btn-secondry " style={{ border: "none", backgroundColor: "white", fontSize:'14px', padding:'8px 10px' }} >SUBSCRIBE</button>
						</div>
					</div>
					<div className="d-flex justify-content-center pt-3 pb-1 ">
						<div className="  w-75 d-flex justify-content-center gap-4">
							<div  >
								<a href="" target="_blank"><FaInstagram style={{ color: "white" }} className='fs-5 mr-2' /></a>
							</div>
							<div  style={{ color: "black" }}>
								<a href="" target="_blank"><FaFacebook style={{ color: "white" }} className='fs-5 mr-2' /></a>
							</div>
							<div  style={{ color: "black" }}>
								<a href="" target="_blank"><FaTiktok style={{ color: "white" }} className='fs-5' /></a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Footer