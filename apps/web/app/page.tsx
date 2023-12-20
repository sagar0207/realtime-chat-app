'use client'

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";

export default function Page() {

  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState('');

  return (
    <div>
      <div>
        <input onChange={(e) => setMessage(e.target.value)} value={message} className={classes["chat-input"]} placeholder="Enter message"/>
        <button onClick={() => sendMessage(message)} className={classes["button"]}>Send</button>
      </div>

      <div>
        <h1>All messages will appear here</h1>
        <ul>
          {messages.map((msg) => <li>{msg}</li>)}
        </ul>
      </div>
    </div>
  )
}