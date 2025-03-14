import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const SlackLogin = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Checking credentials...");

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("✅ User authenticated:", user);

      axios.get(`https://dev-lyd8zg4866wjaxih.us.auth0.com/userinfo`, {
        headers: { Authorization: `Bearer ${user.sub}` }
      })
      .then(response => {
        console.log("✅ Slack User Info:", response.data);

        if (response.data.verifiable_credential) {
          setIsAuthorized(true);
          setLoadingMessage("✅ Access granted! Redirecting...");
          setTimeout(() => {
            window.location.href = `https://slack.com/app_redirect?team=T02UH8HA6S3`;
          }, 2000);
        } else {
          alert("❌ Access Denied: You must have a Verifiable Credential.");
          logout();
        }
      })
      .catch(error => {
        console.error("❌ Error checking VC:", error);
        alert("Error fetching credentials. Please try again.");
      });
    }
  }, [isAuthenticated]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome to Slack OAuth Login</h2>

      {isLoading && <p>🔄 Loading authentication...</p>}

      {error && <p style={{ color: "red" }}>❌ Authentication Error: {error.message}</p>}

      {!isAuthenticated ? (
        <button
          onClick={() => loginWithRedirect({
            connection: "slack",
            authorizationParams: {
              client_id: "oGzpVDcNA9n3OYvzTzDtcMVGGLyp0efz",
              redirect_uri: "https://fzvc-zg4j--3000--495c5120.local-credentialless.webcontainer.io"
            }
          })}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4A154B",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          🔗 Sign In with Slack
        </button>
      ) : (
        <>
          <p>{loadingMessage}</p>
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            style={{
              marginTop: "20px",
              padding: "8px 16px",
              backgroundColor: "#E01E5A",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            🚪 Logout
          </button>
        </>
      )}
    </div>
  );
};

export default SlackLogin;
//