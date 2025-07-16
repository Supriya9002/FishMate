import { Link } from "react-router-dom";
import style from "./Login.module.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { loginAdmin } from "../../Redux/slices/adminSlice";
import { adminActions } from "../../Redux/slices/adminSlice";

function Login() {
  const [formData, setFormdata] = useState({mobaile:"", password:""});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {setIsLogin} = adminActions;
  const {loading, error, successMessage} = useSelector((state)=>state.admin);
  const handleSubmit =async (e)=>{
    e.preventDefault();
    try{
      dispatch(loginAdmin(formData)).then((result)=>{
        if(result.meta.requestStatus === "fulfilled"){
          alert("Admin Login Succesfull");
          dispatch(setIsLogin(true));
          navigate("/");
        }else if(result.meta.requestStatus === "rejected"){
          alert(error);
        }
      })
      setFormdata({mobaile:"", password:""});
    }catch(err){
      console.log("Ram",error)
      console.log(err);
    }
  }
  return (
    <div className={style.SignContainer}>
        <h1 className={style.Sign}>Log In</h1>
        <form className={style.SignForm} onSubmit={handleSubmit}>
            <input placeholder="Enter Mobaile No" type="number" value={formData.mobaile} onChange={(e)=> setFormdata({...formData, mobaile: e.target.value})} required />
            <input placeholder="Enter Password" type="text" value={formData.password} onChange={(e)=> setFormdata({...formData, password: e.target.value})} required/>
            <button type="submit">LogIn</button>
        </form>
        <p className={style.hal}>Don't have an account? <Link to="/Register" className={style.don}>Register</Link> </p>
    </div>
  );
}

export default Login;