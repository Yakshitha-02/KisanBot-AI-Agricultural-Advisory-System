import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className='mx-auto flex min-h-[calc(100vh-120px)] max-w-xl flex-col items-center justify-center px-4 py-20 text-center'>
      <h1 className='text-4xl font-bold text-slate-900'>404</h1>
      <p className='mt-4 text-slate-600'>Page not found. Return to the main dashboard or login page.</p>
      <Link className='mt-6 inline-block rounded-full bg-slate-900 px-6 py-3 text-white' to='/'>
        Go Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
