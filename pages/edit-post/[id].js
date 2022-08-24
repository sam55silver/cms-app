import useSWR from 'swr';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';

const fetcher = async ({ colRef, docID }) => {
  const docRef = doc(colRef, docID);
  const docSnap = await getDoc(docRef);

  return docSnap.data();
};

const Post = ({ colRef }) => {
  const router = useRouter();
  const id = router.query.id;

  const { data, error } = useSWR({ colRef: colRef, docID: id }, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>loading...</div>;

  return <div>Title: {data.postTitle}</div>;
};

export default Post;
