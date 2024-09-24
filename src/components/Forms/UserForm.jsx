import React, { useState } from 'react';
import './forms.css';

const AddUserForm = ({onCancel}) => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    dateJoined: '',
    isStaff: 'no',
    isActive: 'no',
    isProfileCompleted: 'no',
    lastLogin: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('User data:', userData);
  };

  return (
    <div className="form-container">
      <h3>Add New User</h3>
      <form onSubmit={handleSubmit}>
        <div className="head">
          <span>User Details</span>
        </div>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={userData.password}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="dateJoined">Date Joined</label>
        <input
          type="date"
          id="dateJoined"
          name="dateJoined"
          value={userData.dateJoined}
          onChange={handleInputChange}
          required
        />

        <div className="radio-group">
          <label><b>Is Staff</b></label>
          <div className="options">
            <input
              type="radio"
              id="staff_yes"
              name="isStaff"
              value="yes"
              checked={userData.isStaff === 'yes'}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="staff_yes">Yes</label>

            <input
              type="radio"
              id="staff_no"
              name="isStaff"
              value="no"
              checked={userData.isStaff === 'no'}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="staff_no">No</label>
          </div>
        </div>

        <div className="radio-group">
          <label><b>Is Active</b></label>
          <div className="options">
            <input
              type="radio"
              id="active_yes"
              name="isActive"
              value="yes"
              checked={userData.isActive === 'yes'}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="active_yes">Yes</label>

            <input
              type="radio"
              id="active_no"
              name="isActive"
              value="no"
              checked={userData.isActive === 'no'}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="active_no">No</label>
          </div>
        </div>

        <div className="radio-group">
          <label><b>Is Profile Completed</b></label>
          <div className="options">
            <input
              type="radio"
              id="profile_yes"
              name="isProfileCompleted"
              value="yes"
              checked={userData.isProfileCompleted === 'yes'}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="profile_yes">Yes</label>

            <input
              type="radio"
              id="profile_no"
              name="isProfileCompleted"
              value="no"
              checked={userData.isProfileCompleted === 'no'}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="profile_no">No</label>
          </div>
        </div>

        <label htmlFor="lastLogin">Last Login</label>
        <input
          type="date"
          id="lastLogin"
          name="lastLogin"
          value={userData.lastLogin}
          onChange={handleInputChange}
          required
        />

        <div className="form-actions">
          <button type="submit" className="save-btn">Save User</button>
          <button type="reset" className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
