'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toast() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(20, 20, 32, 0.95)',
          color: '#fff',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: '12px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
        },
        success: {
          iconTheme: {
            primary: 'rgb(0, 255, 136)',
            secondary: 'rgba(20, 20, 32, 0.95)',
          },
        },
        error: {
          iconTheme: {
            primary: 'rgb(239, 68, 68)',
            secondary: 'rgba(20, 20, 32, 0.95)',
          },
        },
      }}
    />
  );
}
