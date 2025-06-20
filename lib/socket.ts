import { io, type Socket } from "socket.io-client"

class SocketManager {
  private socket: Socket | null = null
  private static instance: SocketManager

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager()
    }
    return SocketManager.instance
  }

  connect(userId: string): Socket {
    if (!this.socket) {
      try {
        this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:3001", {
          auth: { userId },
          transports: ["websocket", "polling"],
          timeout: 5000,
        })

        this.socket.on("connect_error", (error) => {
          console.warn("Socket connection failed:", error.message)
        })
      } catch (error) {
        console.warn("Failed to initialize socket connection:", error)
      }
    }
    return this.socket!
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket(): Socket | null {
    return this.socket
  }
}

export const socketManager = SocketManager.getInstance()
