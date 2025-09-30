import React, { useState } from "react";

function MailchimpForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "success" | "error" | ""

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      return;
    }

    // Your Mailchimp POST URL (replace with yours)
    const url =
      "https://metaguise.us14.list-manage.com/subscribe/post-json?u=17cd5036871e4f090f4cc8d09&id=4cc89b31ef&c=?";

    try {
      const res = await fetch(
        `${url}&EMAIL=${encodeURIComponent(email)}`,
        { method: "GET", mode: "no-cors" }
      );

      // Since Mailchimp JSONP doesn’t return proper JSON in fetch,
      // we just show success if no error thrown.
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="newsletter-section" style={{ paddingLeft: "25px" }}>
      <h5 className="news-haeding">Stay Updated</h5>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="EMAIL"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            borderRadius: "0",
            border: "1px solid #000",
            padding: "8px 12px",
            marginBottom: "10px",
            width: "100%",
          }}
        />
        <button
          type="submit"
          style={{
            borderRadius: "0",
            padding: "8px 16px",
            width: "100%",
            background: "#000",
            color: "#fff",
            border: "none",
          }}
        >
          Sign Up
        </button>
      </form>

      {/* ✅ Success / Error Messages */}
      {status === "success" && (
        <p style={{ color: "green", marginTop: "8px" }}>
          🎉 You’re subscribed!
        </p>
      )}
      {status === "error" && (
        <p style={{ color: "red", marginTop: "8px" }}>
          ⚠️ Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}

export default MailchimpForm;

