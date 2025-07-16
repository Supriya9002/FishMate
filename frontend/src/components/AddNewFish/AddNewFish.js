import style from "./AddNewFish.module.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addFish } from "../../Redux/slices/fishSlice";
import { useSelector } from "react-redux";


export function AddNewFish() {
    const [FormData, setFormData] = useState({name:"",price:"",availableQuantity:""});
    const navigate = useNavigate();
    const disppatch = useDispatch();
    const {loading, error, successMessage} = useSelector((state)=> state.fish);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        disppatch(addFish(FormData))
        .then((result)=>{
            if(result.meta.requestStatus === "fulfilled"){
                navigate("/");
            }else if(result.meta.requestStatus === "rejected"){
                alert(error);
            }
        })
        setFormData({name:"",price:"",availableQuantity:""});
    }
    return (
        <div className={style.SignContainer}>
            <h1 className={style.Sign}>Add New Fish</h1>
            <form className={style.SignForm} onSubmit={handleSubmit}>
                <input type="text" id="name" name="name" value={FormData.name} onChange={(e)=>setFormData({...FormData, name:e.target.value})} placeholder="Write Fish Name" required />
                <input type="number" id="price" name="price" value={FormData.price} onChange={(e)=>setFormData({...FormData, price:e.target.value})} placeholder="Write Fish Price" required />
                <input type="number" id="quantity" name="quantity" value={FormData.availableQuantity} onChange={(e)=>setFormData({...FormData, availableQuantity:e.target.value})} placeholder="Write Available Quantity" required />
                <button type="submit">
                    {loading ? "Creating" : "Create"}
                </button>
                {error && <p>{error}</p>}
                {successMessage && <p>{successMessage}</p>}
            </form>
        </div>
    );
}
