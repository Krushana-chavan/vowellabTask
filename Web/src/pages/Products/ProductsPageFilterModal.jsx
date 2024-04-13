import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiGET } from '../../utilities/apiHelpers';
import MultiRangeSlider from '../../components/productComponents/multiRangeSlider';
const ProductModalFilter = ({ show, onHide,handlebybrand1 }) => {
    const [catogry, setcatogry] = useState([]);
    const [brand, setBrand] = useState('');
    const [isCategoryOpen, setisCategoryOpen] = useState(false)
    const [isPriceOpen, setisPriceOpen] = useState(false)
    const [isPotsOpen, setisPotsOpen] = useState(false)
    const [isBold, setisBold] = useState('')

    const [minPrice, setminPrice] = useState('')
    const [maxPrice,setmaxPrice] = useState('')
    const [catogryData, setcatogryData] = useState('')



    const getAllBrandNames = async () => {
        try {
            const response = await apiGET(`v1/products/get-unique-brands`)
            if (response?.status === 200) {
                setcatogry(response?.data?.data)
            } else {
                console.error("Error fetching collection data:", response.error);
            }
        } catch (error) {
            console.error("Error fetching collection data:", error);
        }
    }

    const handlebybrand = (item) => {
        setcatogryData(item);
        setisBold(item)

    }

    const toggleCategory = () => {

        setisCategoryOpen(!isCategoryOpen);
    };
    const togglePrice = () => {
		setisPriceOpen(!isPriceOpen);
	};
	const handleOnChange = (e) => {
		setminPrice(e.min)
		setmaxPrice(e.max)
	}
    const togglePots =()=>{
        setisPotsOpen(!isPotsOpen)
    }
    const apllyFilter = () =>{
        handlebybrand1(catogryData)
        onHide()
    }
    const clearFilter = () =>{
        handlebybrand1('')
        onHide()
        setisBold('')


    }


    useEffect(() => {
        getAllBrandNames()

    }, [])

    return (
        <>
            <Modal show={show} onHide={onHide} className='' size="lg" aria-labelledby="contained-modal-title-vcenter">
                <div className='p-3'>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Filter By</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div className='border-bottom border-2 border-dark'>

                                <button
                                    data-bs-toggle="collapse"
                                    data-bs-target="#categoryDropdown"
                                    onClick={toggleCategory}
                                    className="btn px-2 w-100"
                                >
                                    <div class="d-flex justify-content-between   ">
                                        <div className="d-flex pt-1 align-items-center`">Brand</div>
                                        <div className="text-lg">{isCategoryOpen ? "-" : "+"}</div>
                                    </div>
                                </button>
                                <div className={`${isCategoryOpen ? 'show': 'collapse'} p-3`} id="categoryDropdown">
                                    <div style={{ cursor: "pointer" }} ><p style={{ fontSize: "16px" }} className={`${isBold == 'All'|| isBold=="" ? "avenir-medium" : "avenir"} p-0 m-0 mt-2`}> ALL </p></div>

                                    {catogry.map((item,i) => {
                                        return <>	<div  style={{ cursor: "pointer" }} className={` ${item?.brand === isBold ? "avenir-medium" : "avenir"} mt-1 `} onClick={() =>handlebybrand(item?.brand) }>{item?.brand}</div></>
                                    })}
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Body>
                    <div className=" py-0 border-bottom border-2 border-dark">
								<button
									data-bs-toggle="collapse"
									data-bs-target="#priceDropdown"
									onClick={togglePrice}
									className="btn px-2 w-100 "
								>
							<div class="d-flex justify-content-between  ">
								<div className="d-flex pt-1 align-items-center`">Price</div>
									<span className="text-lg">{isPriceOpen ? "-" : "+"}</span>
							</div>
								</button>
							<div className={`collapse my-4 `} id="priceDropdown">
								<div className=" d-flex justify-content-center py-4 " style={{ minWidth: "100%" }}>
									<MultiRangeSlider
										min={0}
										max={1000}
										onChange={(e) => handleOnChange(e)}

									/>
								</div>
							</div>
						</div>
                    </Modal.Body>
                    <Modal.Body>
                        <div className='border-2 border-bottom border-dark py-1' >
                            <button
                            data-bs-toggle="collapse"
                            data-bs-target="#potsdropdonw"
                            onClick={togglePots}
                            className="btn px-2 w-100 ">
                                <div className='d-flex justify-content-between'>
                                    <div>
                                    No. Of Pots
                                    </div>
                                    <div>
                                        {isPotsOpen ?'-':'+'}
                                    </div>
                                    </div>
                            </button>
                            <div className='collapse' id='potsdropdonw'>
                                <div>
                                    <input className='mx-2' type='checkbox'></input>
                                    <label className='mx-2'>5</label>
                                </div>
                                <div>
                                    <input className='mx-2' type='checkbox'></input>
                                    <label className='mx-2'>10</label>
                                </div>
                                <div>
                                    <input className='mx-2' type='checkbox'></input>
                                    <label className='mx-2'>15</label>
                                </div>


                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                    <div className=''>
                        <div className=' gap-1 d-flex justify-content-evenly '>
                        <div className='  d-flex align-items-center'>
                            <Button onClick={clearFilter} className=' border-1 border-dark  rounded-0 ' style={{width:"150px"}} variant="">
                                Clear Filters
                            </Button>
                            </div>
                            <div className='  d-flex align-items-center' >
                            <Button onClick={apllyFilter} className='  border-1 border-dark  rounded-0 ' style={{width:"150px"}} variant="dark">
                                Apply
                            </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ProductModalFilter;
