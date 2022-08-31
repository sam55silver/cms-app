import Link from 'next/link';
import FetchData from '../helper/fetchData';
import useSWR from 'swr';

const body = `
{
  getPosts {
    title
    tags
    desc
    id
  }
}
`;

const ViewPosts = () => {
  const { data, error } = useSWR(body, FetchData);

  if (!data) return <div>Loading...</div>;

  return (
    <div className='container mx-auto my-5'>
      <h1 className='text-2xl mb-5'>Viewing posts</h1>
      <div className='flex gap-5 flex-wrap'>
        {data.getPosts.map((post) => (
          <div key={post.id}>
            <Link href={`/edit-posts/${post.id}`}>
              <div className='bg-slate-400 rounded-md p-5 hover:cursor-pointer'>
                <span>{post.title}</span>
                <p>{post.desc}</p>
                <div className='flex gap-2'>
                  {post.tags.split(',').map((tag, index) => (
                    <span key={index} className='rounded-full bg-green-200 p-2'>
                      {tag}
                    </span>
                  ))}
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
