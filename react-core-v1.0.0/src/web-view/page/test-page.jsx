import React from "react";
import { Avatar } from "@mui/material";
import { Email, Lock, Phone } from "@mui/icons-material";
import "../css-page/test-page.scss";
const UserProfile = () => {
  return (
    <div className="user-profile">
      {/* Avatar + Name */}
      <div className="profile-card">
        <Avatar
          alt="Faroz Akhtar"
          src="https://i.pravatar.cc/100"
          sx={{ width: 80, height: 80 }}
        />
        <h3 className="name">Faroz Akhtar</h3>
        <p className="phone">+965 1234 5678</p>
      </div>

      {/* General Info */}
      <div className="general-info">
        <h4>General information</h4>
        <div className="form-row">
          <div className="form-group">
            <label>First name</label>
            <input type="text" defaultValue="Faroz" />
          </div>
          <div className="form-group">
            <label>Last name</label>
            <input type="text" defaultValue="Akhtar" />
          </div>
        </div>
        <button className="btn update" disabled>
          Update
        </button>
      </div>

      {/* Security */}
      <div className="security">
        <h4>Security</h4>
        <div className="form-row">
          <div className="form-group">
            <label>
              <Email fontSize="small" /> Email
            </label>
            <input type="email" value="address@email.com" disabled />
          </div>
          <div className="form-group">
            <label>
              <Lock fontSize="small" /> Password
            </label>
            <input type="password" value="123456" disabled />
          </div>
          <div className="form-group">
            <label>
              <Phone fontSize="small" /> Phone number
            </label>
            <input type="text" value="+965 1234 5678" disabled />
          </div>
        </div>
        <div className="action-buttons">
          <button className="btn">Change password</button>
          <button className="btn">Change phone number</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
