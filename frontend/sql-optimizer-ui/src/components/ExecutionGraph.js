import React from "react";
import { motion } from "framer-motion";

const ExecutionGraph = ({ plan }) => {

  if (!plan || plan.length === 0) {
    return <p style={{opacity:0.6}}>No execution plan available</p>;
  }

  return (
    <div style={styles.container}>

      {plan.map((step, index) => (
        <React.Fragment key={index}>
          
          <motion.div
            style={styles.node}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            {step}
          </motion.div>

          {index !== plan.length - 1 && (
            <div style={styles.arrow}>↓</div>
          )}

        </React.Fragment>
      ))}

    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "20px"
  },

  node: {
    background: "linear-gradient(135deg,#2a2a72,#009ffd)",
    color: "white",
    padding: "12px 20px",
    borderRadius: "10px",
    fontWeight: "600",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.3)"
  },

  arrow: {
    fontSize: "22px",
    opacity: 0.7
  }
};

export default ExecutionGraph;