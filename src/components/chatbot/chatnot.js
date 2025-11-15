"use client";

import { useEffect } from "react";
import "@n8n/chat/style.css";

export default function N8NChatBot() {
  useEffect(() => {
    import("@n8n/chat").then(({ createChat }) => {
      createChat({
        webhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL,
      });
    }).catch((err) => {
      console.error("Failed to load n8n chat:", err);
    });
  }, []);

  return null;
}