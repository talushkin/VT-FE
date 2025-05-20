import React from "react";
import styles from "./TermsFooter.module.scss";

function TermsFooter({ className = "", isMobile }) {
  return (
    <div className={styles.terms_footer + " " + className}>
      <p className="term-footer-txt">
        © {new Date().getFullYear()}{" "}
        <span className="">VillaTracker</span>.
        {isMobile ? <br /> : null} All rights reserved.{" "}
        <span className="custom-link">
          <a
            style={{ color: "#0d6efd" }}
            href="https://smilinghouse.ch/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
        </span>{" "}
        and <span className="custom-link">
          <a
            style={{ color: "#0d6efd" }}
            href="https://smilinghouse.ch/terms-and-conditions/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </a>
        </span>.
      </p>
    </div>
  );
}
export default TermsFooter;
