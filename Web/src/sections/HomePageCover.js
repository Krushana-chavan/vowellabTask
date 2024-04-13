
import React from 'react'
import { useNavigate } from 'react-router-dom';
import banner from '../assets/banner.jpg'

const HomePageCover = () => {
    const navigate = useNavigate()
    return (
        <div className='w-9 mt-2 pl-4 mr-5'>
            <div className='p-3 m-auto'>
            <img src={banner} className='banner img-fluid' alt="Banner" />
            <div className='text-center mt-4 anton fw-medium headingHome' >Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...</div>
            <div className='fs-5 text-center mt-3 subHeadingHome' >Neque porro quisquam est qui dolorem ipsum !</div>
            <div className='d-flex justify-content-center mt-5 pb-3' >
                <button className="bg-black text-white border-1 rounded-2 px-3 py-2 " style={{ fontSize: "14px" }} onClick={() => navigate("/shop")}>
                    Shop Now
                </button>
            </div>
            </div>      
        </div>
    )
}

export default HomePageCover
