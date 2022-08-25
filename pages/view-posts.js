import useSWR from 'swr';
import Link from 'next/link';
import { getDocs } from 'firebase/firestore';

const fetcher = (colRef) =>
  getDocs(colRef).then((snapshot) => {
    let postsArray = [];

    snapshot.docs.forEach((doc) => {
      postsArray.push({ ...doc.data(), id: doc.id });
      console.log('A read');
    });

    return postsArray;
  });

const ViewPosts = ({ colRef }) => {
  const { data, error } = useSWR(colRef, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div className='container mx-auto my-5'>
      <h1 className='text-2xl mb-5'>Viewing posts</h1>
      <div className='flex gap-5 flex-wrap'>
        {data.map((post) => (
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
