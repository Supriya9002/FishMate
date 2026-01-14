import style from "./Profile.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProfile,
  fetchAdminMetrics,
} from "../../Redux/slices/profileSlice";

export function Profile() {
  const dispatch = useDispatch();
  const { adminProfile, metrics, loading, error } = useSelector(
    (state) => state.profile
  );
  const [activeTab, setActiveTab] = useState("day");

  useEffect(() => {
    dispatch(fetchAdminProfile());
    dispatch(fetchAdminMetrics());
  }, [dispatch]);

  const getMetricData = () => {
    if (!metrics) return null;
    return metrics[activeTab];
  };

  const metricData = getMetricData();

  return (
    <div className={style.profileContainer}>
      {/* Admin Profile Card */}
      {adminProfile && (
        <div className={style.profileCard}>
          <div className={style.profileHeader}>
            <h2>Admin Profile</h2>
          </div>
          <div className={style.profileInfo}>
            <div className={style.infoRow}>
              <span className={style.label}>Name:</span>
              <span className={style.value}>{adminProfile.name}</span>
            </div>
            <div className={style.infoRow}>
              <span className={style.label}>Mobile:</span>
              <span className={style.value}>{adminProfile.mobaile}</span>
            </div>
            <div className={style.infoRow}>
              <span className={style.label}>Member Since:</span>
              <span className={style.value}>
                {new Date(adminProfile.date).toLocaleDateString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Section */}
      {metrics && (
        <div className={style.metricsContainer}>
          <h2 className={style.metricsTitle}>Business Metrics</h2>

          {/* Tab Buttons */}
          <div className={style.tabButtons}>
            <button
              className={`${style.tabBtn} ${
                activeTab === "day" ? style.active : ""
              }`}
              onClick={() => setActiveTab("day")}
            >
              Daily
            </button>
            <button
              className={`${style.tabBtn} ${
                activeTab === "weekly" ? style.active : ""
              }`}
              onClick={() => setActiveTab("weekly")}
            >
              Weekly
            </button>
            <button
              className={`${style.tabBtn} ${
                activeTab === "monthly" ? style.active : ""
              }`}
              onClick={() => setActiveTab("monthly")}
            >
              Monthly
            </button>
            <button
              className={`${style.tabBtn} ${
                activeTab === "yearly" ? style.active : ""
              }`}
              onClick={() => setActiveTab("yearly")}
            >
              Yearly
            </button>
          </div>

          {/* Metrics Cards */}
          {metricData && (
            <div className={style.metricsCards}>
              <div className={style.metricCard}>
                <div className={style.metricIcon}>📊</div>
                <div className={style.metricContent}>
                  <span className={style.metricLabel}>Total Sales Amount</span>
                  <span className={style.metricValue}>
                    ₹{metricData.totalSalesAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              <div className={style.metricCard}>
                <div className={style.metricIcon}>💰</div>
                <div className={style.metricContent}>
                  <span className={style.metricLabel}>Revenue Collected</span>
                  <span className={style.metricValue}>
                    ₹{metricData.totalRevenueCollected?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              <div className={style.metricCard}>
                <div className={style.metricIcon}>⏳</div>
                <div className={style.metricContent}>
                  <span className={style.metricLabel}>Due Outstanding</span>
                  <span className={style.metricValue}>
                    ₹{metricData.totalDueOutstanding?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className={style.loadingContainer}>
          <div className={style.spinner}></div>
          <p>Loading profile...</p>
        </div>
      )}

      {error && (
        <div className={style.errorMessage}>
          <p>
            Error loading profile:{" "}
            {typeof error === "string" ? error : "Unknown error"}
          </p>
        </div>
      )}
    </div>
  );
}
