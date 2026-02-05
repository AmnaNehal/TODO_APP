'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatBox from '@/components/ChatBox';

type Props = {
  userId: string;
  token: string;
};

export default function ChatLauncher({ userId, token }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[60] h-14 w-14 rounded-full shadow-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-[0.98]"
        aria-label="Open chat"
      >
        <MessageCircle size={22} />
      </button>

      {/* Single chat window */}
      {open && (
        <ChatBox
          userId={userId}
          token={token}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
