import style from "./Fish.module.css"
import addUserImg from "./../Data/su.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getAllFish } from "../../Redux/slices/fishSlice";
import outOfStock from "./../Data/close.png"

function Fish() {
    const {fishArr} = useSelector((state)=> state.fish);
    const dispatch = useDispatch();
    // Fetch all fish on component mount
    useEffect(()=>{
        dispatch(getAllFish());
    },[dispatch])
    // console.log("fishArr", fishArr);
    return (
    <>
    <div className={style.fishContainerPage}>
        <div className={style.fishHeader}>
            <span>Available Fish List</span>
            <button><Link to="/addNewFish" className={style.headtext}>Add new fish</Link></button>
        </div>
        
        {fishArr.length === 0 
        ? <h2 className={style.noRecordd}>No Record found</h2> 
        : 
        <div className={style.tablecontainer}>
            <table className={style.leaderboard}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Available Quantity (kg)</th>
                        <th>Price/kg</th>
                        <th>Add Customer</th>
                        </tr>
                        </thead>
                    <tbody>
                        {fishArr.map((fish)=>(
                            <tr key={fish._id}>
                                <td>{fish.name}</td>
                                <td>{fish.availableQuantity === 0 ? <span className={style.outOfStockText}>Out Of Stock</span> : `${fish.availableQuantity} kg`}</td>
                                <td>{fish.price}</td>
                                <td>
                                {fish.availableQuantity > 0 
                                ? 
                                <Link to={`/AddCoustomer/${fish._id}`}><img src={addUserImg} alt="Add-User" className={style.addUserImg}/></Link>
                                : <img src={outOfStock} alt="Out-of-stock" className={style.outOfStock}/>
                                }
                                </td>
                            </tr>))}
                    </tbody>
                </table>
            </div>
        }
    </div>
    </>
    )
}

export default Fish;
