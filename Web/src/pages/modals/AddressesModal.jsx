import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiGET, apiPOST } from '../../utilities/apiHelpers';
import { BiErrorCircle } from 'react-icons/bi';

import Form from 'react-bootstrap/Form';

import { toast } from 'react-toastify';
import InputComp from '../../components/Input/inputComp';

import InputCompforAddress from '../../components/Input/inputCompforAddress';

const AddAddressModal = ({ show, onHide, address, }) => {

    const countries = [

      
        { name: "China", iso: "CN" },
        { name: "India", iso: "IN" },
        { name: "Brazil", iso: "" },
        { name: "South Africa", iso: "ZA" },
        { name: "Russia", iso: "RU" },
        { name: "Mexico", iso: "MX" },
     
      
    ]

    const regions = ["Delhi", "Uttar Pradesh", "Pune", "Bihar"];
    const [saveAddresses, setSaveAddresses] = useState('')
    const [iso, setIso] = useState(address?.iso);
    const [makeDefault, setMakeDefault] = useState(address?.isDefault);
    const [selectedCountry, setSelectedCountry] = useState('')
    const [formErrors, setFormErrors] = useState({})


    const [FormData, setFormData] = useState({
        firstName: '',
        lastName: '',
        addressLineOne: '',
        addressLineTwo: '',
        city: "",
        phoneNo: '',
        country: '',
        state: '',
        zip: '',
        email: ""
    })
    const initialErrors = {
        firstName: '',
        lastName: '',
        phone: '',
        country: '',
        address: '',
        city: '',
        state: '',
        zip: '',

    };
    const clearFormErrors = () => {
        setFormErrors(initialErrors);
    };
    const validateForm = (payload) => {
        console.log('validation', payload)

        if (payload.firstName === undefined || payload?.firstName.trim() === '') {
            setFormErrors({ ...formErrors, firstName: "First name is required *" })
            return false;
        }
        if (payload.lastName === undefined || payload.lastName.trim() === '') {
            setFormErrors({ ...formErrors, lastName: "Last name is required *" })
            return false
        }
        if (payload.phone === '' || payload.phone === undefined) {
            setFormErrors({ ...formErrors, phone: "Phone Number is required *" })
            return false
        }
        if (payload.email === '' || payload.email === undefined) {
            setFormErrors({ ...formErrors, email: "Email is required *" })
            return false;
        }
        if (payload.country === '' || payload.country === undefined) {
            setFormErrors({ ...formErrors, country: "Country name is required *" })
            return false;
        }
        if (payload.address === '' || payload.address === undefined) {

            setFormErrors({ ...formErrors, address: "address is required *" })
            return false;
        }
        if (payload.city === undefined || payload.city.trim() === '') {

            setFormErrors({ ...formErrors, city: "City is required *" })
            return false;
        }
        if (payload.state === undefined || payload.state.trim() === '') {

            setFormErrors({ ...formErrors, state: "State is required *" })
            return false;
        }
        if (payload.zip === '' || payload.zip === undefined) {

            setFormErrors({ ...formErrors, zip: "Zip is required *" })
            return false;
        }


        return true;
    };
    const addMyAddress = async () => {
        try {
            const response = await apiGET('/v1/address/add-address');
            if (response?.status === 200) {
                setSaveAddresses(response?.data); // Assuming the API response contains the list of addresses
            } else {
                console.error("Error fetching Address data:", response.error);
            }
        } catch (error) {
            console.error("Error fetching Address data:", error);
        }
    }

    const handleAddAddress = async () => {
        const newAddress = {
            firstName: FormData?.firstName,
            lastName: FormData?.lastName,
            address: FormData?.addressLineOne,
            addressLine2: FormData?.addressLineTwo,
            city: FormData?.city,
            phone: FormData?.phoneNo,
            iso: iso,
            country: FormData?.country,
            state: FormData?.state,
            zip: FormData?.zip,
            orderNotes: '',
            isDefault: makeDefault,
            email: FormData?.email
        };

        validateForm(newAddress)
        try {
            const response = await apiPOST('/v1/address/add-address', newAddress);

            if (response?.status === 200) {
                addMyAddress();
                onHide();
                toast.success('Address Add Successfuly')

            } else {
                console.error("Error adding address:", response.error);
                toast.error(response?.data?.data)

            }
        } catch (error) {
            console.error("Error adding address:", error);
            toast.error(error)

        }
    }
    const editMyAddress = async () => {
        try {
            let id = address?.id;
            const newAddress = {
                firstName: FormData?.firstName,
                lastName: FormData?.lastName,
                address: FormData?.addressLineOne,
                addressLine2: FormData?.addressLineTwo,
                city: FormData?.city,
                phone: FormData?.phoneNo,
                iso: iso,
                country: FormData?.country,
                state: FormData?.state,
                zip: FormData?.zip,
                orderNotes: '',
                isDefault: makeDefault,
                email: FormData?.email
            };
            const response = await apiPOST(`/v1/address/update-address/${id}`, newAddress)

            if (response?.status === 200) {
                toast.success('Address Updated Successfully')
                onHide()
                // setAddresses(response?.data?.data);
            } else {
                console.error("Error fetching Cart data:", response.error);
                toast.error(response?.data?.data)
            }
        } catch (error) {
            console.error("Error fetching collection data:", error);
            toast.error(error)
        }
    }

    const updateFormData = (name, value) => {
        setFormData({
            ...FormData,
            [name]: value,
        });
    };
    console.log(FormData?.firstName)
    const handleCountryChange = (event) => {
        const selectedCountry = event.target.value;

        let iso = countries.filter(e => e.name == event.target.value).map(e => e.iso).toString();
        setIso(iso)

        setFormData({
            ...FormData,
            country: selectedCountry,
        });
        setSelectedCountry(selectedCountry);
    };



    const cityname = async (data) => {
        console.log('city name ==', data);
    };
    const statename = async (data) => {
        console.log('statename ==', data);
    };
    const pinCode = async (data) => {
        console.log('pincode  == ', data);
    };
    const getCompleteObj = (data) => {
        console.log('getCompleteObj == ', data);


    }

    const addresslinetwos = (data) => {
        // setFormData({
        // 	...formData,
        // 	addressLine2: data
        // });
    }; const setgetaddressdata = (data) => {

    };
    return (
        <>
            <Modal show={show} onHide={onHide} className='' size="lg" aria-labelledby="contained-modal-title-vcenter">
                <div className='p-3'>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Add New Address</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='w-100 p-2'>
                            <div className='d-flex flex-column flex-sm-row justify-content-sm-between'>
                                <div className='row col-sm-6'>
                                    <div className='p-2 h-100'>
                                        <InputComp clearErrors={clearFormErrors} id='firstName' name="firstName" className='w-100 h-75 p-2' type='text' label={`First Name *`} value={FormData?.firstName} updateFormData={updateFormData} />
                                        <p className='text-danger' style={{ fontSize: "15px" }}>{formErrors.firstName ? formErrors.firstName : ''}</p>
                                    </div>
                                </div>
                                <div className='row col-sm-6'>
                                    <div className='p-2 h-100'>
                                        <InputComp clearErrors={clearFormErrors} name="lastName" className='w-100 h-75 p-2' type='text' label={`Last Name *`} value={FormData?.lastName} updateFormData={updateFormData} />
                                        <p className='text-danger' style={{ fontSize: "15px" }}>{formErrors.lastName ? formErrors.lastName : ''}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='mt-2'>
                                    <div className='row'>
                                        <div className='p-2 h-100'>
                                        
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-2 '>
                                    <div className='row'>
                                        <div className='p-2 h-100'>
                                            <InputCompforAddress onChange={(e) => setFormData({ ...FormData, addressLineTwo: e.target.value })}
                                                name="addressLineTwo" label=" Address - line 2 *" value={FormData.addressLineTwo} placeholder="" type="text" updateFormData={updateFormData} clearErrors={clearFormErrors} />                                        </div>

                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <div className='row'>
                                        <div className='p-2 h-100'>
                                            <InputCompforAddress name="city" label="City " onChange={(e) => setFormData({ ...FormData, city: e.target.value })}
                                                value={FormData?.city} required="true" placeholder="" type="text" updateFormData={updateFormData} error={formErrors.city} clearErrors={clearFormErrors} />                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div>
                                <div className='d-flex flex-sm-row flex-column mt-4 justify-content-between'>
                                    <div className='row col-sm-6'>
                                        <div className='p-2 h-100'>
                                            <Form.Group controlId="country">
                                                <Form.Label style={{ marginTop: "8px" }}>
                                                    Country <span style={{}}>*</span>
                                                </Form.Label>
                                                <Form.Select
                                                    value={FormData?.country}
                                                    onChange={handleCountryChange}
                                                    onFocus={() => setFormErrors("")}
                                                    onClick={() => clearFormErrors()}
                                                    style={{ height: "3rem", borderColor: formErrors?.country ? "red" : "black" }}
                                                >
                                                    <option value="" disabled>
                                                        Select a country
                                                    </option>
                                                    {countries.map((country, index) => (
                                                        <option key={index} value={country.name}>
                                                            {country.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {formErrors?.country && (
                                                    <div style={{ color: 'red', paddingTop: '5px', display: 'flex', alignItems: 'center' }}>
                                                        <span className="d-flex" style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                            <BiErrorCircle />
                                                        </span>
                                                        <span style={{ fontSize: '14px', paddingLeft: '5px' }}>This Field is required</span>
                                                    </div>
                                                )}
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className='row col-sm-6 mt-0'>
                                        <InputCompforAddress name="state" onChange={(e) => setFormData({ ...FormData, state: e.target.value })}
                                            label="State" value={FormData?.state} required="true" placeholder="" type="text" mainDivStyle={{ width: "100%", padding: "10px" }} updateFormData={updateFormData} error={formErrors.state} clearErrors={clearFormErrors} />
                                    </div>
                                </div>
                                <div>
                                    <div className='d-flex mt-4 flex-sm-row flex-column justify-content-between'>
                                        <div className='row col-sm-6'>
                                            <InputCompforAddress name="zip" label="Zip / Postal code" value={FormData?.zip} required="true" placeholder="" type="text" onChange={(e) => setFormData({ ...FormData, zip: e.target.value })}
                                                mainDivStyle={{ width: "100%" }} error={formErrors.zip} clearErrors={clearFormErrors} />                                            </div>
                                        <div className='row col-sm-6'>
                                            <InputComp value={FormData?.phoneNo} label="Phone No" required="true" placeholder="" type="text" name="phoneNo" updateFormData={updateFormData} error={formErrors.phoneNo} clearErrors={clearFormErrors} />
                                        <p className='text-danger' style={{ fontSize: "15px" }}>{formErrors.phone ? formErrors.phone : ''}</p>
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column flex-sm-row justify-content-sm-between'>
                                        <div className='row col-sm-6'>
                                            <div className='p-2 h-100'>
                                                <InputComp clearErrors={clearFormErrors} id='firstName' name="email" className='w-100 h-75 p-0' type='text' label={`Email *`} value={FormData?.email} updateFormData={updateFormData} />
                                        <p className='text-danger' style={{ fontSize: "15px" }}>{formErrors.email ? formErrors.email : ''}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <input className="form-check-input" type="checkbox" id="check1" name="option1" value={makeDefault} />
                                        <label className="form-check-label mx-3" htmlFor="check1">Make this my default address</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                    <div className='py-4 px-2 '>
                        <div className='row mt-0 px-4'>
                            <Button className='col-6 rounded-0' variant="primary" onClick={() => { address ? editMyAddress() : handleAddAddress() }}>
                                {address ? 'Update Address' : 'Add Address'}
                            </Button>
                            <div className='col-5 mx-2 d-flex align-items-center'>
                                <Link className='  text-dark' variant="" onClick={onHide}>
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AddAddressModal;
