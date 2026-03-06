import React from "react";
import { motion } from "framer-motion";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

function SuggestionsPanel({ suggestions, analysisTick }) {
  return (
    <section className="panel-card suggestions-card">
      <div className="panel-head">
        <h3>Optimization Suggestions</h3>
      </div>

      {suggestions.length === 0 ? (
        <p className="empty-hint">No suggestions yet</p>
      ) : (
        <motion.ul key={`suggestions-${analysisTick}`} className="suggestions-list" variants={listVariants} initial="hidden" animate="visible">
          {suggestions.map((suggestion, index) => (
            <motion.li key={`${suggestion}-${index}`} variants={itemVariants}>
              {suggestion}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </section>
  );
}

export default SuggestionsPanel;
