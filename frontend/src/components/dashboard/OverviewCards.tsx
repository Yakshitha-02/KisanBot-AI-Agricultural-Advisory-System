function OverviewCards() {
  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <div className='rounded-2xl border bg-white p-5 shadow-sm'>Conversation Count</div>
      <div className='rounded-2xl border bg-white p-5 shadow-sm'>Knowledge Base Items</div>
      <div className='rounded-2xl border bg-white p-5 shadow-sm'>User Satisfaction</div>
      <div className='rounded-2xl border bg-white p-5 shadow-sm'>New Document Uploads</div>
    </div>
  );
}

export default OverviewCards;
