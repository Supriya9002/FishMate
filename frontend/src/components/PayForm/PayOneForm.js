import style from "./PayForm.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCoustomerDetailsByID } from "../../Redux/slices/coustomerSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { onePaymentByCoustomer } from "../../Redux/slices/coustomerSlice";
import { useState } from "react";


export function PayOneForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({Payment:0})
    const {coustomerDetails} = useSelector((State)=> State.coustomer);
    const { coustomerID, transactionID } = useParams();

    useEffect(()=>{
        dispatch(fetchCoustomerDetailsByID(coustomerID))
    },[coustomerID]);
    
    useEffect(()=>{
        if(coustomerDetails?.transactions){
            const coustomerTransactionDetails = coustomerDetails.transactions.find((transaction)=> 
                transaction._id.toString() === transactionID
            )
            console.log("TransactionID", transactionID)
            console.log("coustomerID", coustomerID)
            console.log(coustomerTransactionDetails);
            setFormData({Payment: coustomerTransactionDetails.amountDue})
        }
    },[transactionID])
    const handlePayment = async(e)=>{
        try{
            e.preventDefault();
            await dispatch(onePaymentByCoustomer({Payment: formData.Payment, coustomerID, transactionID}))
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
    // console.log("coustomerDetails in payment page", coustomerDetails, formData)
    return (
        <div className={style.SignContainer}>
            <h1 className={style.Sign}>Payment</h1>
            <form className={style.SignForm} onSubmit={handlePayment}>
                <input type="number" id="price" name="name" placeholder="Write Customer Pay" value={formData.Payment} disabled={!!coustomerDetails} required />
                <button type="submit">Pay</button>
            </form>
        </div>
    );
}
