import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { adminActions } from "../../Redux/slices/adminSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function PrivateRoute({ children }) {

    const {isLogin} = useSelector((state)=> state.admin);
    const dispatch = useDispatch();
    const {setIsLogin} = adminActions;
    const navigate = useNavigate();
    useEffect(()=>{
        const is_login = localStorage.getItem("isLogin");
        console.log("is_login in Protect_Router", is_login);
        if(is_login){
            dispatch(setIsLogin(true));
        }
    },[])
    // console.log("is_login in Protect_Router", isLogin);
    //const { isLogin } = useSelector((state) => state.admin); // Get login state from Redux
    return isLogin ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
