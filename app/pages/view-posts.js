import Link from 'next/link';
import useSWR from 'swr';
import { getPosts } from '../lib/graphql';

const ViewPosts = () => {
  const { data, error } = useSWR([getPosts]);

  console.log('error', error);
  if (error) return <span>Error fetching posts</span>;
  if (!data) return <span>Loading...</span>;

  return (
    <div className='container mx-auto p-5'>
      <h1 className='text-2xl font-bold mb-5'>Viewing posts</h1>
      <div className='flex gap-5 flex-wrap'>
        {data.getPosts.map((post) => (
          <div key={post.id}>
            <Link href={`/edit-posts/${post.id}`}>
              <div className='bg-slate-400 flex flex-col gap-1 rounded-md p-5 h-40 w-48 hover:cursor-pointer '>
                <span>{post.title}</span>
                <p>{post.desc}</p>
                <div className='flex gap-2'>
                  {post.tags
                    ? post.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className='rounded-full bg-green-200 p-2'
                        >
                          {tag}
                        </span>
                      ))
                    : ''}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPosts;
