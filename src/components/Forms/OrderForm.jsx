// import React, { useState } from 'react';
// import axios from 'axios';

// import './forms.css';

// const AddOrderForm = ({onCancel}) => {
//   const [orderData, setOrderData] = useState({
//     user_id: '',
//     order_date: '',
//     order_status: '1',
//     tax_amount: '',
//     total_amount: '',
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setOrderData({ ...orderData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Order data:', orderData);
//     const formData = new FormData();
//     Object.keys(orderData).forEach((key) => {
//       formData.append(key, orderData[key]);
//     });
//     axios.post("http://127.0.0.1:8000/api/v1/orders/list/",formData)
//     .then((res)=>{
//       alert("orderData Added !")
//       window.location.reload()

//     })
//     .catch((err)=>{
//       console.log(err)
//     })
//   };

//   return (
//     <div className="form-container">
//       <h3>Add New Order</h3>
//       <form onSubmit={handleSubmit}>
//         <div className="head">
//           <span>Order Details</span>
//         </div>

//         <label htmlFor="user_id">User</label>
//         <input
//           type="text"
//           id="user_id"
//           name="user_id"
//           value={orderData.user_id}
//           onChange={handleInputChange}
//           required
//         />

//         <label htmlFor="order_date">Order Date</label>
//         <input
//           type="date"
//           id="order_date"
//           name="order_date"
//           value={orderData.order_date}
//           onChange={handleInputChange}
//           required
//         />

//         <label htmlFor="order_status">Order Status</label>
//         <select
//           id="order_status"
//           name="order_status"
//           value={orderData.order_status}
//           onChange={handleInputChange}
//         >
//           <option value="1">Order Placed</option>
//           <option value="2">Pending</option>
//           <option value="3">Dispatched</option>
//           <option value="4">Delivered</option>
//           <option value="5">Canceled</option>
//         </select>

//         <label htmlFor="tax_amount">Tax Amount</label>
//         <input
//           type="text"
//           id="tax_amount"
//           name="tax_amount"
//           value={orderData.tax_amount}
//           onChange={handleInputChange}
//           required
//         />

//         <label htmlFor="total_amount">Total Amount</label>
//         <input
//           type="text"
//           id="total_amount"
//           name="total_amount"
//           value={orderData.total_amount}
//           onChange={handleInputChange}
//           required
//         />

//         <div className="form-actions">
//           <button type="submit" className="save-btn">
//             Save Order
//           </button>
//           <button type="reset" className="cancel-btn" onClick={onCancel}>
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddOrderForm;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './forms.css';

const AddOrderForm = ({ onCancel, initialOrderData, isEdit }) => {
  const [orderData, setOrderData] = useState({
    user_id: '',
    order_date: '',
    order_status: '1',
    tax_amount: '',
    total_amount: '',
  });

  useEffect(() => {
    if (initialOrderData) {
      setOrderData({
        user_id: initialOrderData.user_id || '',
        order_date: initialOrderData.order_date || '',
        order_status: initialOrderData.order_status || '1',
        tax_amount: initialOrderData.tax_amount || '',
        total_amount: initialOrderData.total_amount || '',
      });
    }
  }, [initialOrderData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(orderData).forEach((key) => {
      formData.append(key, orderData[key]);
    });

    if (isEdit) {
      // Update existing order
      axios
        .put(`http://127.0.0.1:8000/api/v1/orders/update/${initialOrderData?.order_id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          alert('Order updated successfully!');
          console.log('Order updated successfully:', response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error updating order:', error.response.data);
        });
    } else {
      // Create a new order
      axios
        .post('http://127.0.0.1:8000/api/v1/orders/list/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          alert('Order created successfully!');
          console.log('Order created successfully:', response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error creating order:', error.response.data);
        });
    }
  };

  return (
    <div className="form-container">
      <h3>{isEdit ? 'Edit Order' : 'Add New Order'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="head">
          <span>Order Details</span>
        </div>

        <label htmlFor="user_id">User</label>
        <input
          type="text"
          id="user_id"
          name="user_id"
          value={orderData.user_id}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="order_date">Order Date</label>
        <input
          type="date"
          id="order_date"
          name="order_date"
          value={orderData.order_date}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="order_status">Order Status</label>
        <select
          id="order_status"
          name="order_status"
          value={orderData.order_status}
          onChange={handleInputChange}
        >
          <option value="1">Order Placed</option>
          <option value="2">Pending</option>
          <option value="3">Dispatched</option>
          <option value="4">Delivered</option>
          <option value="5">Canceled</option>
        </select>

        <label htmlFor="tax_amount">Tax Amount</label>
        <input
          type="text"
          id="tax_amount"
          name="tax_amount"
          value={orderData.tax_amount}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="total_amount">Total Amount</label>
        <input
          type="text"
          id="total_amount"
          name="total_amount"
          value={orderData.total_amount}
          onChange={handleInputChange}
          required
        />

        <div className="form-actions">
          <button type="submit" className="save-btn">
            {isEdit ? 'Update Order' : 'Save Order'}
          </button>
          <button type="reset" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrderForm;

