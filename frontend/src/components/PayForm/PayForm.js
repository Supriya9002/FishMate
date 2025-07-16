import style from "./PayForm.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCoustomerDetailsByID } from "../../Redux/slices/coustomerSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fullPaymentByCoustomer } from "../../Redux/slices/coustomerSlice";
import { useState } from "react";



export function PayForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({Payment:0})
    const {coustomerDetails} = useSelector((State)=> State.coustomer);
    const { coustomerID } = useParams();
    useEffect(()=>{
        dispatch(fetchCoustomerDetailsByID(coustomerID))
    },[coustomerID]);
    
    const handlePayment = async(e)=>{
        try{
            e.preventDefault();
            //write hare code
            // console.log("formData",coustomerDetails?.totalDue);
            await dispatch(fullPaymentByCoustomer({Payment: coustomerDetails?.totalDue, coustomerID}))
            .then((result)=>{
                if(result.meta.requestStatus === "fulfilled"){
                //   alert(successMessage)
                  navigate("/coustomer");
                  setFormData({Payment:0})
                }else if(result.meta.requestStatus === "rejected"){
                  alert("An unknown error occurred");
                }
            })
        }catch(err){
            console.log(err);
        }
    }
    console.log("coustomerDetails in payment page", coustomerDetails, formData)
    return (
        <div className={style.SignContainer}>
            <h1 className={style.Sign}>Payment Full</h1>
            <form className={style.SignForm} onSubmit={handlePayment}>
                <input type="number" id="price" name="name" placeholder="Write Customer Pay" value={coustomerDetails?.totalDue} disabled={!!coustomerDetails} required />
                <button type="submit">Pay</button>
            </form>
        </div>
    );
}
