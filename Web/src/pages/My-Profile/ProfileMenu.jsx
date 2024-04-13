import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';


const ProfileMenu = () => {
	const { userData } = useSelector((state) => state.user);

	const location = useLocation()



	return (<>
		<div className='d-flex  justify-content-md-center  pt-0 px-0 py-md-2 px-md-3 p-lg-4  ' >
			<div className='mt-0 mt-md-4  w-100 '>
				<div className='bg-md-white bg-primaryy pt-5 pt-md-0  d-flex justify-content-end'>
					<div className='mx-5 my-4 mx-md-0 my-md-0 text-white '>:</div>
				</div>
				<div className='px-3 px-md-0'>
					<div style={{ marginTop: "-50px" }} className='d-flex justify-content-md-center '>
						<div className=' rounded-circle d-flex text-white align-items-center justify-content-center  border border-1 border-white ' style={{ width: "90px", height: "90px", fontSize: "40px", backgroundColor: "#EF6C00" }} >
							{userData?.fName?.toUpperCase()[0] + userData?.lName?.toUpperCase()[0]}
						</div>
					</div>
					<div className='mt-1 mt-md-2 text-md-center'>
						<p>{userData?.username}</p>
					</div>
					<div className='mt-1 mt-md-2 text-md-center content-hidden3'>
						<p className='' style={{ fontSize: "14px" }}>{userData?.userTitle}</p>
					</div>
					<div className='d-flex justify-content-md-center  px-md-5  '>
						<div className=' d-flex justify-content-start d-md-table-cell   '>
							<div className='text-md-center px-0 px-md-0 '> 0</div>
							<div className='text-md-center px-2 px-md-0 ' style={{ fontSize: "13px" }}>Followers</div>
						</div>
						<div className=' border mx-1 mx-md-4   '></div>
						<div className=' d-flex justify-content-start d-md-table-cell    '>
							<div className='text-md-center px-1 px-md-0 '>0</div>
							<div className='text-md-center px-1  px-md-0 ' style={{ fontSize: "13px" }}>
								Following
							</div>
						</div>
					</div>
					<div className='mt-2 text-md-center content-hidden4'>
						<p className='' style={{ fontSize: "14px" }}>{userData?.userTitle}</p>
					</div>
				</div>
			</div>
		</div>
		<div className='mt-3'  >
			<div className='mx-3 mx-md-3 mx-lg-4 mb-2 '>
				
				<div className='dropdown-menu w-100	 ' style={{ padding: '0 50px' }}>
					<div className='mt-2 m'>
						<Link to={'/ordersPage'} className={`dropdown-item ${location?.pathname == '/ordersPage' ? 'account-active' : 'account-link'} account-link text-underline-none text-dark underline-none`}> <span>My Orders </span> </Link>
					</div>
					<div className='mt-3'>
						<Link to={'/account/my-addresses'} className={`dropdown-item ${location?.pathname == '/account/my-addresses' ? 'account-active' : 'account-link'} account-link text-underline-none text-dark underline-none`}> <span>My Addresses </span> </Link>
					</div>
				
	

				</div>
				<div className='' style={{ padding: '0 10px' }}>
					<div className='mt-2 content-hidden3 '>
						<Link to={'/ordersPage'} className={`dropdown-item ${location?.pathname == '/ordersPage' ? 'account-active' : 'account-link'} account-link text-underline-none text-dark underline-none`}> <span>My Orders </span> </Link>
					</div>
					<div className='mt-3  content-hidden3'>
						<Link to={'/account/my-addresses'} className={`dropdown-item ${location?.pathname == '/account/my-addresses' ? 'account-active' : 'account-link'} account-link text-underline-none text-dark underline-none`}> <span>My Addresses </span> </Link>
					</div>
				
					
					
				
					
				</div>
			</div>

		</div>


	</>

	)
}

export default ProfileMenu
