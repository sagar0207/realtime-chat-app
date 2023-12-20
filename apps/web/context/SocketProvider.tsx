'use client'

import React, { useCallback, useEffect, useContext, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    sendMessage: (msg: string) => any;
    messages: string[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if(!state) {
        throw new Error(`state is undefined`);
    }
    return state;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {

    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);

    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg: string) => {
        console.log("Send Message: ", msg);
        if(socket) {
            socket.emit("clientEvent:message", {message: msg});
        }
    }, [socket]);

    const onMessageReceived = useCallback((msg: string) => {
        console.log("Message from server: ", msg);
        const { message } = JSON.parse(msg);
        setMessages((prev) => [...prev, message]);
    }, []);

    useEffect(() => {
        // provide socket server info using load balancing if multiple backend servers are up
        const _socket = io('http://localhost:8000');
        _socket.on("serverEvent:message", onMessageReceived);
        setSocket(_socket);

        return () => {
            _socket.disconnect();
            _socket.off("serverEvent:message", onMessageReceived);
            setSocket(undefined);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </SocketContext.Provider>
    )
}