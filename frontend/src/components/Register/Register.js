import style from "./Register.module.css"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerAdmin } from "../../Redux/slices/adminSlice";

function Register() {
  const [formData, setFormdata] = useState({name:"", mobaile:"", password:""});
  const disppatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.admin);
  const handleSubmit = async (e) =>{
    e.preventDefault();
    disppatch(registerAdmin(formData)).then((result)=>{
      console.log("result", result);
      if(result.meta.requestStatus === "fulfilled"){
        alert("Admin Registred Succesfull");
        navigate("/login");
      }else if(result.meta.requestStatus === "rejected"){
        alert(error);
      }
    })
    // Reset form data after submission
    setFormdata({ name: "", mobaile: "", password: "" });
    
  }
  // console.log("formData", formData);
  return (
    <div className={style.SignContainer}>
        <h1 className={style.Sign}>Register</h1>
        <form className={style.SignForm} onSubmit={handleSubmit}>
            <input placeholder="Enter Name" type="text" value={formData.name} onChange={(e)=> setFormdata({...formData, name:e.target.value})} required />
            <input placeholder="Enter Mobaile no" type="number" value={formData.mobaile} onChange={(e)=> setFormdata({...formData, mobaile: e.target.value})} required  />
            <input placeholder="Enter Password" type="text" value={formData.password} onChange={(e)=> setFormdata({...formData, password: e.target.value})} required  />
            <button type="submit">{loading ? "Registering..." : "Register"}</button>
        </form>
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default Register;

