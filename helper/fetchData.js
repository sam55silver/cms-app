import axios from 'axios';

const url = 'http://localhost:5001/cms-app-1a47d/us-central1/app/graphql';

const headers = {
  'content-type': 'application/json',
};

const FetchData = (body, variables) => {
  console.log('Grabbing data');

  return new Promise((res, rej) => {
    axios({
      url: url,
      method: 'post',
      headers: headers,
      data: {
        query: body,
        variables: variables,
      },
    })
      .then(({ data: { data, errors } }) => {
        if (errors) {
          rej(errors);
        } else {
          res(data);
        }
      })
      .catch((err) => {
        rej(err);
        console.log(err);
      });
  });
};

export default FetchData;
