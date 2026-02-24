import React from 'react';

export default function FeedPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-black text-white'>
      <div className='text-center'>
        <h1 className='text-display-md font-bold'>Welcome to your Feed</h1>
        <p className='text-text-lg text-neutral-400'>
          You are seeing this because you are logged in.
        </p>
      </div>
    </div>
  );
}
