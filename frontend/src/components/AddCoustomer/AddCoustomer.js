import style from "./AddCoustomer.module.css"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { addCoustomer } from "../../Redux/slices/coustomerSlice"
import { useParams } from "react-router-dom"
import { fetchFishDetails } from "../../Redux/slices/coustomerSlice"
import { fetchCoustomerDetails } from "../../Redux/slices/coustomerSlice"

export function AddCoustomer(){
  const { fishID } = useParams(); // get the fish ID from the route params
  const [formData, setFormData] = useState({name:"",mobaile:"", payment:"", quantity:"", customerPay: ""});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {fishDetails, coustomerDetails, error, successMessage} = useSelector((state)=>state.coustomer);
  
  //fetch fish details
  useEffect(()=>{
    if(fishID){
      dispatch(fetchFishDetails(fishID));
    }
  },[dispatch, fishID])

  useEffect(()=>{
    if(coustomerDetails){
      setFormData({...formData, name: coustomerDetails.name});
    }
  },[coustomerDetails])
  

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      if(formData.customerPay === "Yes"){
        formData.payment = formData.quantity * fishDetails?.price;
      }else if(formData.customerPay === "No"){
        formData.payment = 0;
      }
      dispatch(addCoustomer({formData, fishID}))
      .then((result)=>{
        if(result.meta.requestStatus === "fulfilled"){
          alert(successMessage)
          navigate("/coustomer");
          setFormData({name:"",mobaile:"", payment:"", quantity:"", customerPay: ""})
        }else if(result.meta.requestStatus === "rejected"){
          alert(error?._message || error || "An unknown error occurred");
        }
    })
    }catch(err){
      console.log(err);
    }
  }

  const handleMobaile = async(e)=>{
    const mobaileNumber = e.target.value;
    // console.log(mobaileNumber)
    if(mobaileNumber.length === 10){
      dispatch(fetchCoustomerDetails(parseInt(mobaileNumber))) //mobaile
    }
    setFormData({...formData, mobaile: parseInt(mobaileNumber)});
    // dispatch(fetchCoustomerDetails({mobaile: parseInt(mobaileNumber)}))
  }

  const handleName = async(e)=>{
    const name = e.target.value;
    // console.log(name, coustomerDetails)
    if(coustomerDetails !== null){
      setFormData({...formData, name: coustomerDetails.name});
    }else{
      setFormData({...formData, name:name});
    }
  }
  console.log(" in addCoustomer.js formData", formData);
  // console.log("coustomerDetails", coustomerDetails);
  return(
  <>
  <div className={style.SignContainer}>
    <h1 className={style.Sign}>Add Customer</h1>
    <form className={style.SignForm} onSubmit={handleSubmit}>

      <input className={style.inputFild} type="number" id="mobile" name="mobile" pattern="[0-9]{10}" 
      value={formData.mobaile} onChange={handleMobaile} placeholder="Write Customer Mobile" required />

      <input className={style.inputFild} type="text" id="name" name="name" value={coustomerDetails ? coustomerDetails.name : formData.name}  
      onChange={handleName} disabled={!!coustomerDetails}  placeholder="Write Customer Name" required />

      <input className={style.inputFild} type="number" id="quantity" name="quantity" value={formData.quantity} 
      onChange={(e)=> setFormData({...formData,quantity: Number(e.target.value)})} placeholder="Write Fish Quantity" required />

      {/* HOW i know fish price, Customer Payment = quantity * price. but fish price avalible in fishschema ,please handle it below*/}
      <strong>Customer Payment ${formData.quantity * fishDetails?.price}</strong>
      <label>
          <input className={style.Labelinput} type="radio" name="customerPay" value="Yes" 
          checked={formData.customerPay === "Yes"} onChange={(e)=>setFormData({...formData, customerPay: e.target.value})}/> Yes
        </label>
        <label>
          <input className={style.Labelinput} type="radio" name="customerPay" value="No"
          checked={formData.customerPay === "No"} onChange={(e)=>setFormData({...formData, customerPay: e.target.value})}/> No
        </label>
      <button type="submit">Add</button>
    </form>
  </div>
  </>
  )
}