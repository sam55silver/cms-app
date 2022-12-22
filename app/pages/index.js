import { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const LogInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  console.log('Router', router);

  const logIn = (event) => {
    event.preventDefault();

    console.log('Email', email);
    console.log('Password', password);

    const requestOptions = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    };
    fetch(
      'http://localhost:5001/cms-app-1a47d/us-central1/server/login',
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('The data from fetch', data);
        router.push('/dashboard');
      });
  };

  const logInInput = 'rounded-sm text-black p-1 col-span-2';

  return (
    <div className='flex justify-center items-center h-screen'>
      <form
        onSubmit={logIn}
        className='rounded-lg bg-slate-600 p-5 text-slate-50'
      >
        <h1 className='font-bold text-2xl'>Log In</h1>
        <div className='grid grid-cols-3 gap-2 mt-5 mb-5'>
          <label>Email:</label>
          <input
            className={logInInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password:</label>
          <input
            className={logInInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className='primary-btn bg-blue-500'>Submit</button>
      </form>
    </div>
  );
};

export default LogInForm;
