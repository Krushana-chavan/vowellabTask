import React, { useEffect, useState } from 'react';
import ProfileMenu from './ProfileMenu';
import Button from '../../components/Button/Button';
import AddAddressModal from '../modals/AddressesModal';
import { apiGET, apiPOST } from '../../utilities/apiHelpers';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const MyAddresses = ({ address }) => {
	const [showModal, setShowModal] = useState(false);
	const [showModalEdit, setShowModalEdit] = useState({});
	const [addresses, setAddresses] = useState([]);
	const { userData } = useSelector((state) => state.user);
	const handleShowModal = () => {
		setShowModal(true);
	};
	const handleCloseModalEdite = (addressId) => {
		setShowModalEdit((prevVisibility) => ({
			...prevVisibility,
			[addressId]: !prevVisibility[addressId],
		}));
	};
	const navigate = useNavigate()

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleAddAddress = (newAddress) => {
		setAddresses([...addresses, newAddress]);
	}

	const getMyAdderss = async () => {
		try {
			const response = await apiGET(`/v1/address/get-my-address`)

			if (response?.status === 200) {

				setAddresses(response?.data?.data);
			} else {
				console.error("Error fetching Cart data:", response.error);
			}
		} catch (error) {
			console.error("Error fetching collection data:", error);
		}
	}

	const RemoveAddress = async (id) => {
		try {
			const response = await apiPOST(`/v1/address/remove-address/${id}`);
			if (response?.status === 200) {
				toast.success('Address Removed Successfully')
				getMyAdderss(); // Refresh the address list after adding a new address
			} else {
				console.error("Error adding address:", response.error);
				toast.error(response?.data?.data)

			}
		} catch (error) {
			console.error("Error adding address:", error);
			toast.error(error)

		}
	}



	useEffect(() => {
		getMyAdderss()
		if(!userData){
			toast.error("Please login first")
			navigate('/')
		}
	}, [showModal, showModalEdit, addresses])


	return (
		<>
			<div className=' container ' >
				<div className=''>
					<div className='px-0 row d-flex justify-content-between' >
						<div className='col-12 mt-md-3 col-md-3 px-0'>
							<ProfileMenu />
						</div>
						<div className='col-12 mt-md-5 mt-2 col-md-8 px-0'>
							<div className=''>
								<div className='px-5 px-md-3 px-lg-5 mt-4 '>
									<div className='row d-flex justify-content-between'>
										<div className='col-12 '>
											<h1 style={{ fontSize: "32px" }} className='anton'>My Addresses</h1>
											<p className='mt-3'>Add and manage the addresses you use often.</p>
										</div>
									</div>
									<div className='border border-1 border-dark border-top-0 mt-4'></div>
									<div className='  mt-3'>
										<div className='  row '>
											
											{addresses?.length ? addresses.map((item, index) => {
												return (<>
													<div className=' '>
														<div className='d-flex gap-2'>
															<p>{item.firstName} </p>
															<p>{item.lastName}</p>
														</div>
														{/* <p>{addresses[0].companyName}</p> */}
														<p>{item.address}</p>
														<p>{item.addressLine2}</p>
														<p>{item.city}</p>
														<div className='d-flex gap-2'>
															<p>{item.state}</p>
															<p>{item.zip}</p>
														</div>
														<p>{item.country}</p>
														<p>{item.phone}</p>
														<div className='d-flex justify-content-between  cursor-pointer' >
															<div className='d-flex justify-content-between gap-4'>
																<p onClick={() => handleCloseModalEdite(item?.id)}>Edit</p>
																<p onClick={() => RemoveAddress(item?.id)}>Remove</p>
															</div>
															<p>{item?.isDefault ? 'Default Address' : ''}</p>
														</div>
														<hr />
													</div>
													<AddAddressModal
														address={item}
														show={showModalEdit[item?.id]}
														onHide={() => handleCloseModalEdite(item?.id)}
													/></>
												)
											})
												:
												<div className=' w-100  mt-4 col-12'>
													<div className='fs-4 text-center my-5'>You haven't saved any addresses yet.</div>
													<div className='mb-4 '>
														<Button onClick={() => handleShowModal()} Title={'Add New Address'} className={'px-sm-3 py-sm-2  '} > </Button>
														<AddAddressModal
															show={showModal}
															onHide={handleCloseModal}
														/>
													</div>
												</div>
											}


										</div>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>

		</>
	)
}

export default MyAddresses
