import React, { createContext,Component } from "react";
import axios from 'axios'
export const MyContext = createContext();



const Axios = axios.create({
    baseURL: 'http://localhost/authontification_api_react-main/reactjs-php-restapi/php-login-registration-api/',
});

class MyContextProvider extends Component{
    constructor(){
        super();
        this.isLoggedIn();
    }
         
     
    state = {
        showLogin:true,
        isAuth:false,
        theUser:null,
    }
    
    
    toggleNav = () => {
        const showLogin = !this.state.showLogin;
        this.setState({
            ...this.state,
            showLogin
        })
    }

    
    logoutUser = () => {
        localStorage.removeItem('loginToken');
        this.setState({
            ...this.state,
            isAuth:false
        })
    }

    registerUser = async (user) => {

        // Sending the user registration request
        const register = await Axios.post('register.php',{
            name:user.name,
            email:user.email,     
            password:user.password 
        });

        return register.data;
    }


    loginUser = async (user) => {
        
        
        const login = await Axios.post('login.php',{
            email:user.email,
            password:user.password
        });
        return login.data;
    }

    // Checking user logged in or not
    isLoggedIn = async () => {
        const loginToken = localStorage.getItem('loginToken');

        if(loginToken){

            //Adding JWT token to axios 
            Axios.defaults.headers.common['Authorization'] = 'bearer '+loginToken;

            
            const {data} = await Axios.get('user-info.php');

            
            if(data.success && data.user){
                this.setState({
                    ...this.state,
                    isAuth:true,
                    theUser:data.user
                });
            }

        }
    }

    render(){
        const contextValue = {
            rootState:this.state,
            toggleNav:this.toggleNav,
            isLoggedIn:this.isLoggedIn,
            registerUser:this.registerUser,
            loginUser:this.loginUser,
            logoutUser:this.logoutUser
        }
        return(
            <MyContext.Provider value={contextValue}>
                {this.props.children}
            </MyContext.Provider>
        )
    }

}

export default MyContextProvider;