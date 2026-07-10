function MessageInput() {
  return (
    <div className='mt-6 flex gap-3'>
      <input className='flex-1 rounded-lg border px-4 py-3' placeholder='Ask KisanBot about crops, weather, or pest control.' />
      <button className='rounded-lg bg-slate-900 px-5 py-3 text-white'>Send</button>
    </div>
  );
}

export default MessageInput;
