import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const ModalSearch = () => {
    const [expanded, setExpanded] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const toggleSearchBar = () => {
        setExpanded(!expanded);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setExpanded(!!e.target.value);
    };

    return (
        <div className=" modal-class">
            <div style={{display:"flex", justifyContent:"space-between", width:"100%", padding:'20px',alignItems:"center"}}>
                <Link to={"/"} className="text-decoration-none">
                    <div className="text-white logo-shadow pb-2 pricedown" >VowelLabs</div>
                </Link>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        className=""
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <button className="btn" onClick={toggleSearchBar}>
                        {expanded ? (
                            <FaTimes style={{ color: "black" }} />
                        ) : (
                            <FaSearch style={{ color: "black" }} />
                        )}
                    </button>
                </div>
                <div style={{ color: "black" }}>
                    Cancel
                </div>
            </div>
        </div>
    );
};

export default ModalSearch;
