import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import HomePageCover from "../../sections/HomePageCover";
import ContactUsForm from "../../sections/ContactUsForm";
import { setlastpath } from "../../redux/users/users";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";


const HomePage = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(()=>{
		if(location?.pathname && location.pathname=="/"){
		  dispatch(setlastpath(location.pathname))
		}
	  },[location])

  return (
    <div>
     
        <HomePageCover />
        <ContactUsForm />
      </div>
   
  );
};

export default HomePage;
