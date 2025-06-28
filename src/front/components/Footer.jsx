// src/front/components/Footer.jsx
import React from 'react';

export function Footer() {
  return (
    <footer className="footer-custom mt-auto">
      <div className="container-fluid">
        <small>SnoutScout copyright {new Date().getFullYear()}</small>
      </div>
    </footer>
  );
}
