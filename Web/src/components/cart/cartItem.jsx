import React, { useEffect, useState } from "react";
import { X } from "react-bootstrap-icons";
import { apiPOST } from "../../utilities/apiHelpers";
import { async } from "q";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const CartItem = ({ cartDetail,getMyCart }) => {
  const [count, setCount] = useState(cartDetail?.quantity);
  const { userData } = useSelector((state) => state.user);
  const removeItemFromCart = async (product) => {
    try {
      let payload = { productId: product };
      const response = await apiPOST("v1/cart/remove-from-cart", payload);
      if (response?.data?.code) {
      } else {
        alert("Error while Product removing!");
      }
    } catch (error) {}
  };
  const noUserRemoveItemFromCart= async (product) => {
    try {
      
      let payload = { productId: product, deviceId: localStorage.getItem("deviceId") };
      const response = await apiPOST("v1/cart/nouser-remove-from-cart", payload);
      if (response?.data?.status) {
        toast.success(response?.data?.data)
        getMyCart()
      } else {
    toast.error("Error while Product removing!");
      }
    } catch (error) {}
  };
  const addToCart = async (product) => {
    try {
      let payload = { productId: product };
      const response = await apiPOST("v1/cart/add-to-cart", payload);
      if (response?.data?.status) {
      toast.success(response?.data?.data)
        return true;
      } else {
        toast.error(response?.data?.data);
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  const removeFromCart = async (product) => {
    try {
      let payload = { productId: product };
      const response = await apiPOST("v1/cart/remove-from-cart", payload);
      if (response?.data?.status) {
        toast.success(response?.data?.data?.data);
        getMyCart()
        return true;
      } else {
        toast.error(response?.data?.data?.data);
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  function increment() {
    setCount(function (prevCount) {
      const res = addToCart(cartDetail?.productId);
      if (res) {
        return (prevCount += 1);
      } else {
        toast.error("getting error while  adding to cart");
      }
    });
  }

  const removeCart = async () => {
    try {
      let payload = { productId: cartDetail?.productId };
      console.log(payload);
      const response = await apiPOST("v1/cart/remove-cart", payload);
      if (response?.data?.code) {
      
        toast.success("Cart Removed Successfully");
        getMyCart()
        console.log(response);
      } else {
        alert("Error while Product removing!");
      }
    } catch (error) {}
  };

  const noUserRemoveCart = async () => {
    try {
      let payload = { productId: cartDetail?.productId,deviceId: localStorage.getItem("deviceId"), };
      console.log(payload);
      const response = await apiPOST("v1/cart/nouser-remove-cart", payload);
      if (response?.data?.code) {
        toast.success("Cart Removed Successfully");
        getMyCart()
        console.log(response);
      } else {
        alert("Error while Product removing!");
      }
    } catch (error) {}
  };
  const handleClickRemoveCart = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeCart();
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
      }
    });
  };

  function decrement() {
    setCount(function (prevCount) {
      const res =  removeFromCart(cartDetail?.productId);
      if (prevCount > 0) {
        if (res) {
          return (prevCount -= 1);
        } else {
          alert("getting error while removing to cart");
        }
      } else {
        return (prevCount = 0);
      }
    });
  }
  useEffect(() => {}, [cartDetail]);

  return (
    <>
      <div className="border-bottom pb-3  "></div>
   
      <div className="row mt-5 mb-2">
        <div className="p-1 col-4 col-lg-3 col-sm-4 d-flex justify-content-center ">
          <div className=" ">
            <img
              src={cartDetail?.productDetails[0]?.productImageUrl}
              alt=""
              width={100}
            />
          </div>
        </div>
        <div className="col-6 col-sm-6 col-lg-6 fs-6 opacity-75">
          <div>{cartDetail?.productDetails[0]?.name}</div>

          <div className="mt-2">₹{cartDetail?.productDetails[0]?.price}</div>
        </div>
        <div className="col-2 col-lg-3">
          <div className="w-100 d-flex justify-content-end fs-4 cursor-pointer ">
            <X onClick={userData?removeCart:noUserRemoveCart} />
          </div>
        </div>
        <div className="col-5"></div>
        {!cartDetail?.productDetail[0]?.subProduct?
        <div className="col-4 col-lg-3  opacity-75">
          <div className="row border m-auto border-black">
            <div
              onClick={decrement}
              className="col-4 text-center cursor-pointer "
            >
              -
            </div>
            <div className="col-4 text-center">{count}</div>
            <div
              onClick={increment}
              className="col-4 text-center cursor-pointer"
            >
              +
            </div>
          </div>
        </div>:null}
        <div className="col-3 col-lg-4 text-center d-flex justify-content-end  opacity-75">
          ₹{(cartDetail?.productDetails[0]?.price * count).toFixed(2)}
        </div>

        {cartDetail?.productDetail[0]?.subProduct?.length>0?

           <div style={{background:""}}>
       <p style={{marginLeft:60,marginTop:10,fontWeight:"bold",color:"black"}}>Products :</p>
        </div>:null}

       
        {cartDetail?.productDetail[0]?.subProduct.map((item, index) => (
                         <div className="row   mb-2" style={{marginLeft:15}}>
                         <div className=" col-4 col-lg-3 col-sm-4 d-flex justify-content-center ">
                           <div className=" ">
                             <img
                               src={item?.productDetailsObj?.productImageUrl}
                               alt=""
                               width={80}
                             />
                           </div>
                         </div>
                         <div className="col-6 col-sm-6 col-lg-6 fs-6 opacity-75">
                           <div>{item?.productDetailsObj?.name}</div>
                 
                           <div className="mt-2">Quantity {item?.quantity}</div>
                           <div className="mt-2">₹{item?.productDetailsObj?.price}</div>
                         </div>
                         </div>      
                            ))}
       
        
      </div>
    </>
  );
};

export default CartItem;
