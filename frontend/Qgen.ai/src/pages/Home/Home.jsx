import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from "axios";
import "./Home.css";

function Home() {
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      storeUserData(user);
    }
  }, [isAuthenticated, user]);

  async function storeUserData(user) {
    try {

        await axios.post("http://localhost:8000/user/create", {
          auth0Id: user.sub,
          name: user.name,
          email: user.email,
          picture: user.picture,
        });
    } catch (error) {
      console.error("Error storing user:", error);
    }
  }

  return (
    <>
      <div className="grid-pattern"></div>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="gradient-text">
              Transform PDFs into Interactive Quizzes
            </h1>
            <p className="subtitle">
              Harness the power of AI to automatically generate engaging quizzes from your PDF documents. Experience the future of learning.
            </p>

            {isAuthenticated ? (
              <button onClick={() => logout()} className="cta-button">
                Logout
              </button>
            ) : (
              <button onClick={() => loginWithRedirect()} className="cta-button">
                Login
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
