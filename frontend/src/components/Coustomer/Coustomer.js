import style from "./Coustomer.module.css"
import { Link } from "react-router-dom"
import payImg from "./../Data/payment.png"
import { useDispatch } from "react-redux"
import { fetchAllCoustomer } from "../../Redux/slices/coustomerSlice"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import check from "./../Data/check.png"
import zero from "./../Data/zero.png"

export function Coustomer(){
    const {coustomerArr} = useSelector((state)=> state.coustomer);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fetchAllCoustomer());
    },[])

    const getTotalBuy = ((coustomer)=>{
        if(!coustomer.transactions || coustomer.transactions.length === 0){
            return 0;
        }
        return coustomer.transactions.reduce((pre, curr)=>{
            return pre + (curr.price * curr.quantity);
        },0)
    })
    
    // console.log("coustomerArr[0].transactions", coustomerArr[0].transactions)
    return(
        <>
        <div className={style.CoustomerDivContainer}>
            {/* <div className={style.seachContainer}>
                <input type="text" placeholder="Enter Name or Mobaile Numbar"/>
                <button type="submit">Search</button>
            </div> */}
            {coustomerArr.length === 0 
            ? 
            <h2 className={style.noRecord}>No Record found</h2>
            : 
            <div className={style.CoustomerDiv}>
    <table className={style.Coustomertable}>
        <thead>
            <tr>
                <th>Name</th>
                <th>Mobile NO</th>
                <th>Total Buy</th>
                <th>Due Payment</th>
                <th>Pay Full</th>
                <th>Customer Details</th>
            </tr>
        </thead>
        <tbody>
            {coustomerArr.map((coustomer)=>(
                <>
                <tr>
                    <td>{coustomer.name}</td>
                    <td>{coustomer.mobaile}</td>
                    <td>{getTotalBuy(coustomer)}</td>
                    <td>{coustomer.totalDue === 0 ? <img src={zero} alt="ZeroImg" className={style.checkImg}/> : coustomer.totalDue}</td>
                    <td>
                        {
                        coustomer.totalDue ===0 
                        ? 
                        <img src={check} alt="PayImg" className={style.checkImg}/>
                        : <Link to={`/toPay/${coustomer._id}`}><img src={payImg} alt="PayImg"/></Link>
                        }
                    </td>
                    <td><Link to={`/details/${coustomer._id}`}>Details</Link></td>
                </tr>
                </>
            ))}
        </tbody>
    </table>
            </div>
            }

        </div>
        </>
    )
}