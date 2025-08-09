'use client'
import { useState, useEffect } from "react";

import Image from "next/image";

export default function Home() {
  const [message, setMessage] = useState('Loading...');
  useEffect(() =>{
    const fetchmessage = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${apiUrl}/`);
        if(!response.ok){
          throw new Error("Failed to fetch data from backend");
        }
        const data = await response.text();
        setMessage(data);
      } catch (error){
        console.error(error);
        setMessage('Failed to connect to the backend.');
      }
    };

    fetchmessage();
  }, []);
  return (
       <main style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>Monopoly Game</h1>
      <p style={{ fontSize: '1.2rem', color: '#555' }}>
        Message from Backend: <strong style={{ color: '#0070f3' }}>{message}</strong>
      </p>
    </main>
  );
}
