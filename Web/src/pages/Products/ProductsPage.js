import React, { useEffect, useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { FcPrevious } from "react-icons/fc";
import { FcNext } from "react-icons/fc";
import { PiArrowsDownUpFill } from "react-icons/pi";
import { LuFilter } from "react-icons/lu";
import { BiSortAlt2 } from "react-icons/bi";
import Card from "../../components/productComponents/Card";
import MultiRangeSlider from "../../components/productComponents/multiRangeSlider";
import { apiGET } from "../../utilities/apiHelpers";
const Sort = () => {
  return <span className=" mr-2"> SORT BY </span>;
};
const ProductPage = () => {
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [maxPrice, setmaxPrice] = useState(100);
  const [minPrice, setminPrice] = useState(0);
  const [sliderMinValue, setSliderMinValue] = useState(0);
  const [sliderMaxValue, setSliderMaxValue] = useState(100);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [selectedOption, setSelectedOption] = useState(null);

  const togglePrice = () => {
    setIsPriceOpen(!isPriceOpen);
  };

  const getAllProducts = async (sortByPrice, sort) => {
    try {
      const response = await apiGET(
        `/v1/products/get-all-products?filter[query]={sort[${
          sort || "name"
        }]=${sortByPrice || 1}&page=${page}&minPrice=${
          minPrice || 0
        }&maxPrice=${parseFloat(maxPrice) || 100}`
      );
    console.log(response)
      if (response?.status === 200) {
        setTotalPages(response?.data?.data?.totalPages);
        setProducts(response?.data?.data?.data);
      } else {
        console.error("Error fetching collection data:", response.error);
      }
    } catch (error) {
      console.error("Error fetching collection data:", error);
    }
  };

  const handleChangefilter = (number) => {
    let sortByPrice;
    let sort;
    if (number == 1) {
      setSelectedOption("Newest");
      sort = "createdAt";
      sortByPrice = 1;
      getAllProducts(sortByPrice, sort);
    } else if (number == 2) {
      setSelectedOption("Price (low to high)");
      sort = "price";

      sortByPrice = 1;
      getAllProducts(sortByPrice, sort);
    } else if (number == 3) {
      setSelectedOption("Price (high to low)");
      sort = "price";

      sortByPrice = -1;
      getAllProducts(sortByPrice, sort);
    } else if (number == 4) {
      setSelectedOption("Name A-Z");
      sort = "name";
      sortByPrice = 1;
      getAllProducts(sortByPrice, sort);
    } else if (number == 5) {
      setSelectedOption("Name Z-A");
      sort = "name";
      sortByPrice = -1;
      getAllProducts(sortByPrice, sort);
    }
  };
  const handleOnChange = (e) => {
   
    setminPrice(e.min);
    setmaxPrice(e.max);
  };

  const handleclearfilter = () => {
    setIsPriceOpen(false);
    setminPrice(0);
    setmaxPrice(100);
    setSliderMaxValue(100);
    setSliderMinValue(0);
  };

  useEffect(() => {
    getAllProducts();
    window.scrollTo(0, 0);
  }, [maxPrice, minPrice, page,  ]);


  return (
    <div className="main-container  ">
      <div className=" d-flex justify-content-center  text-center p-4 ">
        <div
          className="px-4 fs-3  mt-4 text-center  anton1  "
          style={{ letterSpacing: "5px" }}
        >
          SHOP ALL
        </div>
      
      </div>
      <div className=" mb-3 content-hidden4 px-sm-5 px-4 fs-4">
        <div
          className=" w-100 d-flex flex-row gap-4 justify-content-center align-items-center"
          style={{flexWrap:"wrap"}}
        >
          
          <div
            className=" dropdown cursor-pointer btn btn btn-outline-secondary"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div className=" d-flex flex-row gap-2 align-items-center ">
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
          <div
          
            className="btn btn btn-outline-secondary cursor-pointer d-flex flex-row gap-2 align-items-center "
          >
            <LuFilter /> <span>Filter</span>
          </div>
        </div>
      
      </div>

      <div className=" container p-0 d-flex">
        <div className="mt-2 d-none d-md-block" style={{ minWidth: "250px" }}>
          <div className="  p-3   " style={{ width: "100%" }}>
            <div
              className="pt-0 fs-3  pb-4"
              style={{ "border-bottom": "1px solid grey" }}
            >
              <div>Filter By</div>
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
                <div
                  className=" d-flex justify-content-center "
                  style={{ minWidth: "100%" }}
                >
                  <MultiRangeSlider
                    min={sliderMinValue}
                    max={sliderMaxValue}
                    onChange={(e) => handleOnChange(e)}
                  />
                </div>
              </div>
            </div>
            <div className=" py-4 cursor-pointer">
              <div onClick={() => handleclearfilter()}>
                {" "}
                <span >
                  Clear Filter x
                </span>{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid p-0  ">
          <div className="d-none d-md-block">
            <div className="d-flex justify-content-end pt-4 pb-1`">
              <DropdownButton
                as={ButtonGroup}
                key={"SORT BY"}
                variant="Success"
                title={
                  selectedOption ? (
                    selectedOption
                  ) : (
                    <>
                      <BiSortAlt2 style={{ marginTop: "-4px" }} />
                      <Sort />
                    </>
                  )
                } 
                className="btn btn-outline-secondary d-flex justify-content-between"
                onSelect={handleChangefilter}
                noCaret
              >
                <Dropdown.Item eventKey="1">Newest</Dropdown.Item>
                <Dropdown.Item eventKey="2">Price (low to high)</Dropdown.Item>
                <Dropdown.Item eventKey="3">Price (high to low)</Dropdown.Item>
                <Dropdown.Item eventKey="4">Name A-Z</Dropdown.Item>
                <Dropdown.Item eventKey="5">Name Z-A </Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
          <div className="container">
            <div className="row">
              {products.length > 0
                ? products?.map((item, index) => (
                    <div key={index} className="col-6 col-lg-4 col-xl-3">
                      <Card productDetail={item} />
                    </div>
                  ))
                : ""}
            </div>
          </div>
        </div>
      </div>
 
      <div className="container d-flex justify-content-center align-items-center">
        {page > 1 && (
          <div
            className="page-indicator cursor-pointer"
            onClick={() => setPage(page - 1)}
            style={{ marginRight: "15px" }}
          >
            <FcPrevious />
          </div>
        )}

        <div aria-label="Page navigation example" style={{ marginTop: 20 }}>
          <ul className="pagination">
            {page === 1 && (
              <li className="page-item">
                <span
                  className="page-link font-weight-bold cursor-pointer"
                  onClick={() => setPage(1)}
                  style={{ background: "#f5f5f5" }}
                >
                  1
                </span>
              </li>
            )}

            {page !== 1 && (
              <li className="page-item">
                <span
                  className="page-link cursor-pointer"
                  onClick={() => setPage(page - 1)}
                >
                  {page - 1}
                </span>
              </li>
            )}

            {page !== 1 && (
              <li className="page-item">
                <span
                  className="page-link cursor-pointer"
                  onClick={() => setPage(page)}
                  style={{ background: "#f5f5f5" }}
                >
                  {page}
                </span>
              </li>
            )}
            {page !== totalPages && (
              <li className="page-item">
                <span
                  className="page-link cursor-pointer"
                  onClick={() => setPage(page + 1)}
                >
                  {page + 1}
                </span>
              </li>
            )}
          
          </ul>
        </div>

        {page < totalPages && (
          <div
            className="page-indicator cursor-pointer"
            onClick={() => setPage(page + 1)}
            style={{ marginLeft: "15px" }}
          >
            <FcNext />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
