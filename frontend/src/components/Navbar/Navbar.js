import styles from "./Navbar.module.css"
import {Link} from "react-router-dom"
import HomeImg from "./../Data/house.png"
import coustomerImg from "./../Data/rating.png"
import profileImg from "./../Data/user.png"
import logoutImg from "./../Data/logout.png"
import { Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { adminActions } from "../../Redux/slices/adminSlice";
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"


export function Navbar(){
    const {isLogin, currentLocationPath} = useSelector((state)=> state.admin);
    const dispatch = useDispatch();
    const {setIsLogin, setCurrentLocationPath} = adminActions;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=>{
        const is_login = localStorage.getItem("isLogin");
        console.log("is_login", is_login);
        if(is_login){
            dispatch(setIsLogin(true))
        }
    },[])
    //set path in localStorage
    useEffect(()=>{
        dispatch(setCurrentLocationPath(location.pathname));
        localStorage.setItem("Path", location.pathname)
    })
    // console.log("currentLocationPath",currentLocationPath)
    const handleLogout = (e)=>{
        alert("Log Out Succesful")
        e.preventDefault()
        localStorage.removeItem('authToken');
        localStorage.removeItem('isLogin'); //userData
        localStorage.removeItem('userData');
        dispatch(setIsLogin(false))
        navigate("/login")
    }
    // console.log("In Navbar", isLogin);
    return(
        <>
        <div className={styles.divNavbarContainer}>
            {/* App Name */}
            <Link to="/" className={styles.underlineR}>
                <span className={styles.appname}>FishMate</span>
            </Link>
            <div className={styles.navPageContainer}>
                {/* Home */}
                <Link to="/" className={styles.underlineRmv}>
                    <img src={HomeImg} alt="HomeImg"/>
                    <span>Home</span>
                </Link>
                
                {/* Coustomer */}
                <Link to="/coustomer" className={styles.underlineRmv}>
                    <img src={coustomerImg} alt="coustomerImg"/>
                    <span>Coustomer</span>
                </Link>

                {/* Profile */}
                <Link to="/profile" className={styles.underlineRmv}>
                    <img src={profileImg} alt="profileImg"/>
                    <span>Profile</span>
                </Link>

                {
                isLogin === false
                ? <Link to="/login" className={styles.underlineRmv}>
                    <img src={logoutImg} alt="logoutImg"/>
                    <span>LogIn</span>
                  </Link>
                : <Link className={styles.underlineRmv} onClick={handleLogout}>
                    <img src={logoutImg} alt="logoutImg"/>
                    <span>LogOut</span>
                  </Link>
                }

                
            </div>
        </div>
        <Outlet/>
        </>
    )
}