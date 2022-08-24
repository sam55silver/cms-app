import Link from 'next/link';

const Navigation = () => {
  return (
    <div className='flex flex-col gap-5 bg-slate-400 h-full p-5 text-2xl'>
      <Link href='/'>
        <span className='nav-btn'>Create Post</span>
      </Link>
      <Link href='/view-posts'>
        <span className='nav-btn'>View Posts</span>
      </Link>
    </div>
  );
};

export default Navigation;
