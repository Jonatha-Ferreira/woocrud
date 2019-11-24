import React, { useState, useEffect , Fragment } from 'react';
import {connect} from 'react-redux';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

import {  Paper, Typography, TextField, Button, FormControl, 
          InputLabel, Select, FilledInput, MenuItem } from '@material-ui/core';

import API from '../../API/'; 

import {loading , updateUser , storeUserProfile , storeUserData} from '../../store/actions/';

import ToggleDisplay from 'react-toggle-display';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Slide from '@material-ui/core/Slide';

const Transition = (props) =>{
    return <Slide direction="up" {...props} />;
}

const UserSettings = ({ dispatch , USER , USER_PROFILE}) => {
        
    const [showOldPasswordField,setShowOldPasswordField]             = useState( false)
    const [oldPassword,setOldPassword]                               = useState( "")
    const [newPassword,setNewPassword]                               = useState("")
    const [confirmationNewPassword,setConfirmationNewPassword]       = useState("")
    const [showSubmitButton,setShowSubmitButton]                     = useState( false)
    const [validEmail,setValidEmail]                                 = useState( false)
    const [userID,setUserId]                                         = useState("");
    const [userName,setUserName]                                     = useState("")
    const [userEmail,setUserEmail]                                   = useState("")
    const [firstName,setFirstName]                                   = useState("")
    const [lastName,setLastName]                                     = useState("")
    const [userUrl,setUserUrl]                                       = useState("")
    const [userAvatar,setUserAvatar]                                 = useState("")
    const [successPasswordChange,setSuccessPasswordChange]           = useState( false)
    const [isLoaded,setIsLoaded]                                     = useState(false)

    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
        return (value !== newPassword) ? false : true;
    });
    
    ValidatorForm.addValidationRule('minChars', (value) => {
        return (value.length < 8) ? false : true;
    });
    
    ValidatorForm.addValidationRule('maxChars', (value) => {
        return (value.length > 25) ? false : true;
    });
    
    ValidatorForm.addValidationRule('isCustomEmail', (value) => {
        var regex = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        return regex.test(value);
    });

    useEffect(()=>{
      // SHOW LOADER
      if(USER_PROFILE == null){
            dispatch(loading(true, "header-loader"));
            API.WP_getProfileInfo(USER.token)
            .then((result)=>{
                // HIDE LOADER
                setUserId(result.id);
                setUserName(result.username);
                setUserEmail(result.email);
                setFirstName(result.first_name);
                setLastName(result.last_name);
                setUserUrl(result.url);
                setIsLoaded(true);
                dispatch(loading(false, "header-loader"));
                dispatch(storeUserData(result));
            })
            .catch((error)=>{
    
                dispatch(({
                    type    : 'ERROR',
                    payload : error
                }))
    
                // HIDE LOADER
                dispatch(loading(false, "header-loader"));
            })
        }else{
            setUserId(USER_PROFILE.id);
            setUserName(USER_PROFILE.username);
            setUserEmail(USER_PROFILE.email);
            setFirstName(USER_PROFILE.first_name);
            setLastName(USER_PROFILE.last_name);
            setUserUrl(USER_PROFILE.url);
            setIsLoaded(true);
        }
    },[])
   

    function updateProfile(property){   
        
        if( (property === 'email') && !validEmail ) return;

        // SHOW LOADER
        dispatch(loading(true, "header-loader"));

        let data = { 
            id              : userID,
            email           : userEmail,
            first_name      : firstName,
            last_name       : lastName,
            url             : userUrl,
        };
        let dataStore = {...USER_PROFILE , ...data };
        API.WP_updateProfileInfo(USER.token, data )
            .then((result)=>{
                // HIDE LOADER
                dispatch(loading(false, "header-loader"));
                dispatch(storeUserData(dataStore));
            })
            .catch((error)=>{
                dispatch(({
                    type    : 'ERROR',
                    payload : error
                }))
                // HIDE LOADER
                dispatch(loading(false, "header-loader"));
            })
       
    }

    function keyPressHandler(e){
        if(e.keyCode === 13)
            e.target.blur();
    }

    function submitChangePassword(){

        dispatch(loading(true, "header-loader"));

        let payload = {
            id              : userID,
            old_password    : oldPassword,
            new_password    : newPassword
        }
 
        API.WP_change_password(USER.token, payload)
            .then((result)=>{
                dispatch(loading(false, "header-loader"));
                setOldPassword('');
                setNewPassword('');
                setConfirmationNewPassword('');
                setSuccessPasswordChange(true);
                setShowOldPasswordField(false);
                 
            })
            .catch((error)=>{

                dispatch(({
                    type    : 'ERROR',
                    payload : error
                }))
                // HIDE LOADER
                dispatch(loading(false, "header-loader"));
            })
    }

    function renderContent(){
        return (
            <Fragment>
                <Paper className="container-inner user"  elevation={1}>
                    <Typography variant="h5" component="h4">User Name</Typography>
                    <TextField
                        label="User Name"
                        value={userName}
                        className="field"
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        variant="filled"
                        fullWidth
                        disabled
                    />

                    <ValidatorForm
                        // forwardRef="form-email"
                        onSubmit={()=>{}}
                        onError={errors => console.log(errors)}
                    >   
                        <TextValidator
                            label="Email"
                            onBlur={(e)=>updateProfile('email')}
                            onKeyDown={(e)=>keyPressHandler(e)}
                            onChange={(e) => setUserEmail(e.target.value)}
                            name="email"
                            value={userEmail}
                            validatorListener={(valid)=>setValidEmail(valid)}
                            validators={[
                                'required', 
                                'isCustomEmail'
                            ]}
                            errorMessages={[ 
                                "this field is required", 
                                "Email id incorrect"
                            ]}
                            className="field"
                            type="text"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                        <TextValidator
                            label="First Name"
                            onKeyDown={(e)=>keyPressHandler(e)}
                            onChange={(e) => setFirstName(e.target.value)}
                            onBlur={(e)=>updateProfile('firstName')}
                            name="first-name"
                            value={firstName}
                            className="field"
                            type="text"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            validators={['required']}
                            errorMessages={['This field is required']}
                        />
                        <TextValidator
                            label="Last Name"
                            onKeyDown={(e)=>keyPressHandler(e)}
                            onChange={(e) => setLastName(e.target.value)}
                            onBlur={(e)=>updateProfile('lastName')}
                            name="last-name"
                            value={lastName}
                            className="field"
                            type="text"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            validators={['required']}
                            errorMessages={['This field is required']}
                        />
                        <TextValidator
                            label="Website"
                            onKeyDown={(e)=>keyPressHandler(e)}
                            onChange={(e) => setUserUrl(e.target.value)}
                            onBlur={(e)=>updateProfile('userUrl')}
                            name="last-name"
                            value={userUrl}
                            className="field"
                            type="text"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                    </ValidatorForm>
                    <ValidatorForm
                        // forwardRef="form"
                        onSubmit={submitChangePassword.bind(this)}
                        onError={errors => console.log(errors)}
                    >
                        <Button 
                            id="change-password" 
                            color="primary" 
                            onClick={()=> setShowOldPasswordField(!showOldPasswordField)}
                        >
                            { !showOldPasswordField ? "CHANGE PASSWORD" : "CANCEL" }
                        </Button>
                        
                        {successPasswordChange ? <p id="success-password-change">Your password has been changed</p> : null}

                        <ToggleDisplay show={showOldPasswordField}>
                            <p id="helper-text">Mandatory Password Field</p>

                            <TextValidator
                                label="Current Password"
                                value={oldPassword}
                                className="field"
                                onChange={(e)=>setOldPassword(e.target.value)}
                                type="password"
                                name="oldPassword"
                                validators={[
                                    'required'
                                ]}
                                errorMessages={[
                                    'This field is required'
                                ]}
                                InputLabelProps={{ shrink: true }}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                        
                            <TextValidator
                                label="New Password"
                                value={newPassword}
                                className="field"
                                onChange={(e)=>setNewPassword(e.target.value)}
                                type="password"
                                name="password"
                                validators={[
                                    'required', 
                                    'minChars', 
                                    'maxChars'
                                ]}
                                errorMessages={[
                                    "this field is required"
                                ]}
                                InputLabelProps={{ shrink: true }}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                            <TextValidator
                                label="Confirm Your Password"
                                value={confirmationNewPassword}
                                className="field"
                                type="password"
                                name="repeatPassword"
                                onChange={(e)=>setConfirmationNewPassword(e.target.value)}
                                validators={[
                                    'isPasswordMatch', 
                                    'required', 
                                    'minChars', 
                                    'maxChars'
                                ]}
                                errorMessages={[
                                    "Password not match",
                                    "This field is required"
                                ]}
                                validatorListener={(valid)=>setShowSubmitButton(valid)}
                                InputLabelProps={{ shrink: true }}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                            <Button id="submit-change-password" disabled={!(showSubmitButton && oldPassword.length)} type="submit" variant="contained"  color="primary" >
                                Change Password
                            </Button>                             

                        </ToggleDisplay>
                    </ValidatorForm>
                </Paper>
            </Fragment>
        )
    }
    
    return (
        <div id="profile-page">
            <Header />
            <div id="container">
                { isLoaded && renderContent() }
            </div>
        </div>
        
    );
}


const mapStateToProps = ({ USER , USER_PROFILE  }) => ({ USER , USER_PROFILE });

export default connect(mapStateToProps)(UserSettings);