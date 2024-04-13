import React, { useState, useRef, useEffect } from 'react';
import { LockFill } from 'react-bootstrap-icons';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';


const OrderSummeryComp = (props) => {
    const { myCartData, totalPrice,  deliveryCharg} = props;
        let totalAmountToPay = Number(totalPrice) + Number(deliveryCharg)
    return (
        <div className="" style={{ marginBottom: "30px" }}>
            <div style={{ padding: "15px", marginBottom: "20px", backgroundColor: "#0000000f", border: "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h5>Order Summary  ({myCartData?.length || 0})</h5>
                    <Link to="/cart"><span style={{ textDecoration: "underline", color: "black" }}><h5>Edit Cart</h5></span></Link>
                </div>
                <hr />
                {myCartData ? <>
                    {myCartData.map((item, i) => (
                        <>
                            {item?.hasOwnProperty("productDetail") ?

                                <div style={{ background: "" }}>
                                    <p style={{ marginLeft: 10, marginTop: 10, fontWeight: "bold", color: "black" }}>Product :</p>
                                </div> : null}
                            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                                <div className='d-flex  '>
                                    <div className=''>
                                        <img
                                            src={item?.productDetails[0]?.productImageUrl}
                                            alt="Product Image"
                                            style={{ width: "60px", height: "60px", marginRight: "20px" }}
                                        />
                                    </div>

                                    <div className=''>

                                        <div>{item?.productDetails[0]?.name} </div>
                                        <p className='' style={{}}>Qty : {item?.quantity} </p>

                                    </div>

                                </div>
                                <div className='d-flex justify-content-end'>  <p>{item?.sale_price ? <span><span className='line-through-text'>₹{(item?.productDetails[0]?.price * item?.quantity).toFixed(2)}</span> ₹{(item?.sale_price * item?.quantity).toFixed(2)}</span> : <span>₹{(item?.productDetails[0]?.price * item?.quantity).toFixed(2)} </span>}</p></div>

                            </div>

                            {item?.productDetail[0]?.subProduct.map((myitem, index) => (
                                <div className="row   mb-2" style={{ marginLeft: 15 }}>
                                    <div className=" col-4 col-lg-3 col-sm-4 d-flex justify-content-center ">
                                        <div className=" ">
                                            <img
                                                src={myitem?.productDetailsObj?.productImageUrl}
                                                alt=""
                                                width={80}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-6 col-lg-6 fs-6 opacity-75">
                                        <div>{myitem?.productDetailsObj?.name}</div>

                                        <div className="mt-2">Quantity {myitem?.quantity}</div>
                                        <div className="mt-2">₹{myitem?.productDetailsObj?.price}</div>
                                    </div>
                                </div>
                            ))}


                        </>))}</> : 'no data found'}
                <hr />
              
            
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "15px" }}>
                    <div><h4>Total</h4></div>
                    <div>{ `₹ ${Number(totalPrice).toFixed(2)} + ${deliveryCharg}  = ${totalAmountToPay}`}</div>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LockFill style={{ fontSize: "2rem", marginRight: "10px", height: "18px" }} /> Secure Checkout
            </div>
        </div>

    );
}

export default OrderSummeryComp;