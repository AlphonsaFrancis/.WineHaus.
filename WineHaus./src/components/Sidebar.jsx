// import React, { useState } from "react";
// import "./sidebar.css";
// import { RiArrowRightSFill } from "react-icons/ri";
// import { RiArrowDownSFill } from "react-icons/ri";


// function Sidebar({setSelectedMenu}) {
//   const [showProductSubmenu, setShowProductSubmenu] = useState(true);
//   const [showOrderSubmenu, setShowOrderSubmenu] = useState(false);
//   const [showStaffSubmenu, setShowStaffSubmenu] = useState(false);
//   const [showUserSubmenu, setShowUserSubmenu] = useState(false);

//   const handleProductTitleClick = () => {
//     setShowProductSubmenu((prevState) => !prevState);
//   };

//   const handleOrderTitleClick = ()=>{
//     setShowOrderSubmenu((prevState)=>!prevState)
    
//   }
//   const handleStaffTitleClick=()=>{
//     setShowStaffSubmenu((prevState)=>!prevState)
//   }

//   const handleUserTitleClick=()=>{
//     setShowUserSubmenu((prevState)=>!prevState)
//   }
//   return (
//     <div className="sidebar-container">
//       <div className="title">
//         <span style={{ color: "green" }}>W</span>ineHaus
//       </div>
//       <div className="sidebar-menus">
//         {/* Products */}
//         <div className="menu-title" onClick={handleProductTitleClick}>
//           <span>Products </span>
//           {showProductSubmenu ? <RiArrowDownSFill  className="menu-icon"/>: <RiArrowRightSFill />}
//         </div>
//         {showProductSubmenu && (
//           <>
//             <div className="menu-item" onClick={()=>setSelectedMenu('allProducts')}>All Products</div>
//             <div className="menu-item" onClick={()=>setSelectedMenu('brands')}>Brands</div>
//             <div className="menu-item" onClick={()=>setSelectedMenu('categories')}>Categories</div>
//             <div className="menu-item" onClick={()=>setSelectedMenu('countries')}>Countries</div>
//             <div className="menu-item" onClick={()=>setSelectedMenu('madeOf')}>Made of</div>
//           </>
//         )}

//         {/* Orders */}
//         <div className="menu-title" onClick={handleOrderTitleClick}>
//         <span>Orders </span>
//           {showOrderSubmenu ? <RiArrowDownSFill  className="menu-icon"/>: <RiArrowRightSFill />}
//         </div>
//         {showOrderSubmenu && (
//           <>
//             <div className="menu-item" onClick={()=>setSelectedMenu('allOrders')}>All Orders</div>
//             {/* <div className="menu-item" onClick={()=>setSelectedMenu('newOrders')}>New Orders</div> */}
//           </>
//         )}

//         {/* Staffs */}
//         <div className="menu-title" onClick={handleStaffTitleClick}>
//         <span>Staffs </span>
//           {showStaffSubmenu ? <RiArrowDownSFill  className="menu-icon"/>: <RiArrowRightSFill />}
//         </div>
//         {showStaffSubmenu && (
//           <>
//             <div className="menu-item" onClick={()=>setSelectedMenu('allStaffs')}> All Staffs</div>
//             {/* <div className="menu-item" onClick={()=>setSelectedMenu('deactivatedStaffs')}>Deactivated Staffs</div> */}
//           </>
//         )}

//         {/* Users */}
//         <div className="menu-title" onClick={handleUserTitleClick}>
//         <span>Users </span>
//           {showUserSubmenu ? <RiArrowDownSFill  className="menu-icon"/>: <RiArrowRightSFill />}
//         </div>
//         {showUserSubmenu && (
//           <>
//             <div className="menu-item" onClick={()=>setSelectedMenu('allUsers')}>All Users</div>
//             {/* <div className="menu-item" onClick={()=>setSelectedMenu('deactivatedUsers')}>Deactivated Users</div> */}
//           </>
//         )}
//       </div>

      
//     </div>
//   );
// }

// export default Sidebar;

import React, { useState } from "react";
import "./sidebar.css";
import { RiArrowRightSFill, RiArrowDownSFill } from "react-icons/ri";

function Sidebar({ setSelectedMenu }) {
  const [selectedMenu, setActiveMenu] = useState("");
  const [showProductSubmenu, setShowProductSubmenu] = useState(true);
  const [showOrderSubmenu, setShowOrderSubmenu] = useState(false);
  const [showStaffSubmenu, setShowStaffSubmenu] = useState(false);
  const [showUserSubmenu, setShowUserSubmenu] = useState(false);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setSelectedMenu(menu);
  };

  return (
    <div className="sidebar-container">
      <div className="title">
        <span style={{ color: "green" }}>W</span>ineHaus
      </div>
      <div className="sidebar-menus">
        {/* Products */}
        <div className="menu-title" onClick={() => setShowProductSubmenu((prev) => !prev)}>
          <span>Products</span>
          {showProductSubmenu ? <RiArrowDownSFill className="menu-icon" /> : <RiArrowRightSFill />}
        </div>
        {showProductSubmenu && (
          <>
            <div
              className={`menu-item ${selectedMenu === "allProducts" ? "active" : ""}`}
              onClick={() => handleMenuClick("allProducts")}
            >
              All Products
            </div>
            <div
              className={`menu-item ${selectedMenu === "brands" ? "active" : ""}`}
              onClick={() => handleMenuClick("brands")}
            >
              Brands
            </div>
            <div
              className={`menu-item ${selectedMenu === "categories" ? "active" : ""}`}
              onClick={() => handleMenuClick("categories")}
            >
              Categories
            </div>
            <div
              className={`menu-item ${selectedMenu === "countries" ? "active" : ""}`}
              onClick={() => handleMenuClick("countries")}
            >
              Countries
            </div>
            <div
              className={`menu-item ${selectedMenu === "madeOf" ? "active" : ""}`}
              onClick={() => handleMenuClick("madeOf")}
            >
              Made of
            </div>
          </>
        )}

        {/* Orders */}
        <div className="menu-title" onClick={() => setShowOrderSubmenu((prev) => !prev)}>
          <span>Orders</span>
          {showOrderSubmenu ? <RiArrowDownSFill className="menu-icon" /> : <RiArrowRightSFill />}
        </div>
        {showOrderSubmenu && (
          <>
            <div
              className={`menu-item ${selectedMenu === "allOrders" ? "active" : ""}`}
              onClick={() => handleMenuClick("allOrders")}
            >
              All Orders
            </div>
          </>
        )}

        {/* Staffs */}
        <div className="menu-title" onClick={() => setShowStaffSubmenu((prev) => !prev)}>
          <span>Staffs</span>
          {showStaffSubmenu ? <RiArrowDownSFill className="menu-icon" /> : <RiArrowRightSFill />}
        </div>
        {showStaffSubmenu && (
          <>
            <div
              className={`menu-item ${selectedMenu === "allStaffs" ? "active" : ""}`}
              onClick={() => handleMenuClick("allStaffs")}
            >
              All Staffs
            </div>
          </>
        )}

        {/* Users */}
        <div className="menu-title" onClick={() => setShowUserSubmenu((prev) => !prev)}>
          <span>Users</span>
          {showUserSubmenu ? <RiArrowDownSFill className="menu-icon" /> : <RiArrowRightSFill />}
        </div>
        {showUserSubmenu && (
          <>
            <div
              className={`menu-item ${selectedMenu === "allUsers" ? "active" : ""}`}
              onClick={() => handleMenuClick("allUsers")}
            >
              All Users
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;

