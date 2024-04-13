import React, { useEffect, useState } from "react";
import { BsSearch, BsX } from 'react-icons/bs';

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { PiArrowsDownUpFill } from 'react-icons/pi'
import { LuFilter } from 'react-icons/lu'
import Card from "../../components/productComponents/Card";
import MultiRangeSlider from "../../components/productComponents/multiRangeSlider";
import { apiGET } from "../../utilities/apiHelpers";
import ProductModalFilter from "./ProductsPageFilterModal";
import { useLocation } from "react-router-dom";
const Sort = () => {
    return <span className=" mr-2"> SORT BY </span>;
};

const SearchProductResults = () => {
    const [searchText, setSearchText] = useState('');

    const handleInputChange = (e) => {
        setSearch(e.target.value);
    };

    const handleClearSearch = () => {
        setSearch('');
    };
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [isCategoryOpen, setCategoryOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState(queryParams.get('search') || '')
    const [brand, setBrand] = useState("")

    const [maxPrice, setmaxPrice] = useState(100);
    const [minPrice, setminPrice] = useState(0);
    const [sliderMinValue, setSliderMinValue] = useState(0)
    const [sliderMaxValue, setSliderMaxValue] = useState(100)
    const [catogry, setcatogry] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState()
    const [selectedOption, setSelectedOption] = useState(null);
    const [ productCount,setProductCount] = useState(0)



    const toggleCategory = () => {
        setCategoryOpen(!isCategoryOpen);
    };
    const togglePrice = () => {
        setIsPriceOpen(!isPriceOpen);
    };


    const getAllProducts = async (sortByPrice, sort) => {
        try {
            const response = await apiGET(`/v1/products/get-all-products?filter[query]={search:${search},brand:${brand}}&sort[${sort || 'price'}]=${sortByPrice || 1}&page=${page}&minPrice=${minPrice || 0}&maxPrice=${maxPrice || 100}`)
            setTotalPages(response?.data?.data?.totalPages);
            if (response?.status === 200) {
                setProductCount(response?.data?.data?.totalResults);
                setProducts(response?.data?.data?.data);
            } else {
                console.error("Error fetching collection data:", response.error);
            }
        } catch (error) {
            console.error("Error fetching collection data:", error);
        }
    }
    const getAllBrandNames = async () => {
        try {
            const response = await apiGET(`v1/products/get-unique-brands`)
            if (response?.status === 200) {
                console.log(response?.data?.data)
                setcatogry(response?.data?.data)
            } else {
                console.error("Error fetching collection data:", response.error);
            }
        } catch (error) {
            console.error("Error fetching collection data:", error);
        }
    }


    const handleChangefilter = (number) => {
        //alert(number)
        let sortByPrice;
        let sort;

        if (number == 1) {

            setSelectedOption("Newest");
            sort = 'createdAt'
            sortByPrice = 1
            getAllProducts(sortByPrice, sort)
        }
        else if (number == 2) {
            setSelectedOption("Price (low to high)");
            sort = 'price'

            sortByPrice = 1
            getAllProducts(sortByPrice, sort)
        }
        else if (number == 3) {
            setSelectedOption("Price (high to low)");
            sort = 'price'

            sortByPrice = -1
            getAllProducts(sortByPrice, sort)
        }
        else if (number == 4) {
            setSelectedOption("Name A-Z");
            sort = 'name'
            sortByPrice = 1
            getAllProducts(sortByPrice, sort)
        }
        else if (number == 5) {
            setSelectedOption("Name Z-A");
            sort = 'name'
            sortByPrice = -1
            getAllProducts(sortByPrice, sort)
        }


    }
    const handleOnChange = (e) => {
        /* setBrand(""); */
        setminPrice(e.min)
        setmaxPrice(e.max)
    }
    const handlebybrand1 = (item) => {
        if (item === 'All') setBrand("")

        else setBrand(item)

    }
    const handleclearfilter = () => {
        setCategoryOpen(true);
        setIsPriceOpen(false);
        setBrand("");
        setminPrice(0);
        setmaxPrice(100);
        setSliderMaxValue(100)
        setSliderMinValue(0)
    }
    const showFilter = () => {
        setShowModal(true)
    };
    const onHideFilter = () => {
        setShowModal(false)
    }


    useEffect(() => {


        getAllProducts();
        getAllBrandNames();

    }, [maxPrice, minPrice, page, brand, search]);

    return (
        <div className="main-container   " >
            <div className=" container d-flex justify-content-center  text-center " style={{ marginTop: '30px'  }}>
                <div className=" w-100">

                    <div className='' style={{ position: "relative" }}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={handleInputChange}
                            style={{ padding: "10px 30px 10px 10px", width: "100%", boxSizing: "border-box" }}
                        />
                        <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "10px" }}>
                            <button
                                onClick={search ? handleClearSearch : null}
                                style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "10px", border: "none", background: "transparent", cursor: "pointer" }}
                            >
                                {searchText ? <BsX style={{ fontSize: '27px' }} /> : <BsSearch style={{ fontSize: '27px' }} />}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <div className=" mb-3 content-hidden4 px-sm-5 px-4 " style={{ fontSize: '16px', marginTop: '10px' }} >
                <div className=" w-100 d-flex flex-row gap-2 align-items-center" style={{ justifyContent: 'space-between' }}>
                    <div className="" style={{ fontSize: '10px' }}>
                        {productCount ? `${productCount} items found for "${search}" ` : ""}
                    </div>
                    <div className=" dropdown cursor-pointer " data-bs-toggle="dropdown" aria-expanded="false">
                        <div className=" d-flex flex-row gap-2 align-items-center " >
                            <PiArrowsDownUpFill /> <span>Sort by</span>
                        </div>
                        <div className="dropdown-menu">
                            <div className="dropdown-item">Sort by</div>
                            <div className="dropdown-item">Newest</div>
                            <div className="dropdown-item">Price (Low To High)</div>
                            <div className="dropdown-item">Price (High To Low)</div>
                            <div className="dropdown-item">Name A - Z</div>
                            <div className="dropdown-item">Name Z - A</div>
                        </div>
                    </div>
                    <div onClick={showFilter} className=" cursor-pointer d-flex flex-row gap-2 align-items-center ">
                        <LuFilter /> <span>Filter</span>
                    </div>
                </div>
                <ProductModalFilter handlebybrand1={handlebybrand1} show={showModal} onHide={onHideFilter} />
            </div>


            <div className=" container p-0 d-flex">
                <div className="mt-2 d-none d-md-block" style={{ minWidth: "250px" }}>
                    <div className="  p-3   " style={{ width: "100%" }}>
                        <div
                            className="pt-0 fs-5 anton1  pb-4"
                        // style={{ "border-bottom": "1px solid grey" }}
                        >
                            <div>Filter By</div>
                        </div>

                        {/* category */}
                        <div
                            className=" py-4"
                            style={{ "border-bottom": "1px solid grey" }}

                        >
                            <div class="d-flex justify-content-between  ">
                                <div className="d-flex pt-1  align-items-center`">Category</div>
                                <button
                                    data-bs-toggle="collapse"
                                    data-bs-target="#categoryDropdown"
                                    onClick={toggleCategory}
                                    className="btn p-0 "
                                >
                                    <span className="text-lg">{isCategoryOpen ? "-" : "+"}</span>
                                </button>
                            </div>
                            <div className={`${isCategoryOpen ? 'show' : 'collapse'}`} id="categoryDropdown">
                                <div style={{ cursor: "pointer", }} className={`${brand == 'All' || brand == '' ? 'avenir-medium' : 'avenir'} thumbnail`}
                                    onClick={() => setBrand('')}> ALL </div>
                                {catogry.map((item) => {
                                    return <div style={{ cursor: "pointer", }}
                                        className={` ${item?.brand === brand ? "avenir-medium" : 'avenir'} thumbnail`}
                                        onClick={() => handlebybrand1(item?.brand)}
                                    >{item?.brand}</div>
                                })}
                            </div>
                        </div>


                        <div
                            className=" py-4"
                            style={{ "border-bottom": "1px solid grey" }}
                        >
                            <div class="d-flex justify-content-between  ">
                                <div className="d-flex pt-1 align-items-center`">Price</div>
                                <button
                                    data-bs-toggle="collapse"
                                    data-bs-target="#priceDropdown"
                                    onClick={togglePrice}
                                    className="btn p-0 "
                                >
                                    <span className="text-lg">{isPriceOpen ? "-" : "+"}</span>
                                </button>
                            </div>
                            <div className={`collapse my-4 `} id="priceDropdown">
                                <div className=" d-flex justify-content-center " style={{ minWidth: "100%" }}>
                                    <MultiRangeSlider
                                        min={sliderMinValue}
                                        max={sliderMaxValue}
                                        onChange={(e) => handleOnChange(e)}

                                    />
                                </div>
                            </div>
                        </div>


                        <div className=" py-4">
                            <div onClick={() => handleclearfilter()}> <span /* style={{cursor:'pointer'}} */>Clear Filter x</span> </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid p-0  " style={{ margin: '13px 0', fontSize: '20px' }} >
                    <div className="d-none d-md-block" >
                        <div className="d-flex" style={{ justifyContent: 'space-between' }}  >
                            <div className="mt-3" style={{ fontSize: '14px' }}>
                            {productCount ? `${productCount} items found for "${search}" ` : ""}
                            </div>
                            <DropdownButton
                                as={ButtonGroup}
                                key={"SORT BY"}
                                variant="Success"

                                title={selectedOption ? selectedOption : <><Sort /></>}
                                className=" d-flex justify-content-between mt-2 "
                                onSelect={handleChangefilter}
                                noCaret

                            >
                                <Dropdown.Item eventKey="1" >Newest</Dropdown.Item>
                                <Dropdown.Item eventKey="2">Price (low to high)</Dropdown.Item>
                                <Dropdown.Item eventKey="3" >Price (high to low)</Dropdown.Item>
                                <Dropdown.Item eventKey="4">Name A-Z</Dropdown.Item>
                                <Dropdown.Item eventKey="5">Name Z-A </Dropdown.Item>


                            </DropdownButton>
                        </div>
                    </div>
                    <div className="container mt-4">
                        <div className="row">
                            {products.length > 0 ?
                                products.map((item, index) => (
                                    <div key={index} className="col-6 col-lg-4 col-xl-3">
                                        <Card productDetail={item} />
                                    </div>
                                )) : ""}
                        </div>
                    </div>
                </div>

            </div>


        </div>
    );
}

export default SearchProductResults;
