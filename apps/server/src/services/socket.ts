import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
    host: "redis-3d9001ae-patel97sagar-49d5.a.aivencloud.com",
    port: 26361,
    username: "default",
    password: "AVNS_qGLTVhNWKYS8iFxev2f",
});

const sub = new Redis({
    host: "redis-3d9001ae-patel97sagar-49d5.a.aivencloud.com",
    port: 26361,
    username: "default",
    password: "AVNS_qGLTVhNWKYS8iFxev2f",
});

class SocketService {
    private _io: Server;

    constructor() {
        console.log("Init Socket Service....");
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*'
            }
        });
        // subscribe to "MESSAGES" channel
        sub.subscribe("MESSAGES");
    }

    public initListeners() {
        console.log("Init Socket Listeners...");

        this.io.on("connect", (socket) => {
            console.log(`New Socket Connected`, socket.id);
            socket.on("clientEvent:message", async ({message}: {message: string}) => {
                console.log("New message received.", message);

                // publish message to redis
                await pub.publish("MESSAGES", JSON.stringify({ message }));
            });
        });

        sub.on("message", (channel, message) => {
            if(channel === "MESSAGES") {
                console.log("Message from redis: ", message);
                this.io.emit("serverEvent:message", message);
            }
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;