## Headless Content Management System

This headless CMS App uses multiple technologies to create a full stack experience with a cloud function based server, coupled with a dashboard web app to create, modify and delete content with ease.

The server is run on firebase functions which is ran through googles cloud. GraphlQL is used as the API that is ran on express. This API gives a single end-point URI for fast and flexible front-end development.

The web app uses NextJS and Tailwind to create a beautiful dashboard with dynamic routes. I used NextJS as I love the file structure based routes, it makes development very organized. Tailwind is used for quick iterations while not restricting creative ability. Other notability dependencies are react-hot-toast for beautiful notification pop ups and axios for ease of fetching data from the headless cms server.