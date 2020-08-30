import React from 'react';
import {Route,Redirect} from "react-router-dom";
import Base from '../core/Base';

const UserDashBoard=()=>{
    return (
        <Base title="User Dash Board">
            <h2>Welcome user!</h2>
        </Base>
    );
}

export default UserDashBoard;