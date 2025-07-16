import style from "./CoustomerDetails.module.css"
import payImg from "./../Data/payment.png"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { fetchCoustomerDetailsByID, fetchFishDetails } from "../../Redux/slices/coustomerSlice"
import { useParams } from "react-router-dom"
import moment from "moment"
import check from "./../Data/check.png"
import zero from "./../Data/zero.png"

export function CoustomerDetails() {
    const { coustomerDetails, fishDetails } = useSelector((state) => state.coustomer);
    const dispatch = useDispatch();
    const { coustomerID } = useParams();
    
    // Local state to store fish details for each transaction
    const [fetchedFishNames, setFetchedFishNames] = useState({});
    
    useEffect(() => {
        dispatch(fetchCoustomerDetailsByID(coustomerID));
    }, [dispatch, coustomerID]);
    
    useEffect(() => {
        if (coustomerDetails?.transactions) {
            coustomerDetails.transactions.forEach(transaction => {
                // Fetch fish details for each transaction's fishID
                if (!fetchedFishNames[transaction.fishID]) {
                    dispatch(fetchFishDetails(transaction.fishID))
                        .unwrap()  // Get the result from the fulfilled action
                        .then(fishData => {
                            setFetchedFishNames(prevState => ({
                                ...prevState,
                                [transaction.fishID]: fishData.name,
                            }));
                        });
                }
            });
        }
    }, [coustomerDetails, dispatch, fetchedFishNames]);
    
    const groupTransactionsByDate = (transactions) => {
        return transactions.reduce((grouped, transaction) => {
            const date = moment(transaction.date).format('DD-MM-YYYY');
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(transaction);
            return grouped;
        }, {});
    };

    const groupedTransactions = coustomerDetails?.transactions
        ? groupTransactionsByDate(coustomerDetails.transactions)
        : {};

    return (
        <div className={style.CoustomerDetailsDivContainer}>
            <div className={style.CoustomerDetails}>
                <span className={style.header}>Customer Details</span>
                <span className={style.name}>{coustomerDetails?.name}</span>
                <span className={style.mobaileNo}>{coustomerDetails?.mobaile}</span>
            </div>

            {Object.keys(groupedTransactions).map((date) => (
                <div className={style.CoustomerTableDiv} key={date}>
                    <span>Date: {date}</span>
                    <table className={style.CoustomerTable}>
                        <thead>
                            <tr>
                                <th>Fish</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total Buy</th>
                                <th>Total Due</th>
                                <th>Pay</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedTransactions[date].map((details, index) => (
                                <tr key={index}>
                                    <td>{fetchedFishNames[details.fishID] || 'Loading...'}</td>
                                    <td>{details.quantity}</td>
                                    <td>{details.price}</td>
                                    <td>{details.quantity * details.price}</td>
                                    <td>
                                        {details.amountDue === 0 
                                            ? <img src={zero} alt="ZeroDue" className={style.checkImg} /> 
                                            : details.amountDue}
                                    </td>
                                    <td>
                                        {details.amountDue === 0 
                                            ? <img src={check} alt="CheckImg" className={style.checkImg} /> 
                                            : <Link to={`/toPay/${coustomerDetails._id}/${details._id}`}><img src={payImg} alt="PayImg" /></Link>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}
