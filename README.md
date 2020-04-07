# Beers API to Practice with React (or other SPA's)

This is the source code for this API: <a href="https://ih-beers-api.herokuapp.com">https://ih-beers-api.herokuapp.com </a>. The documentation is also hosted on this domain.

You need to create a .env file in the root directory with the following variables:
```
DB=mongodb://yourmongodbconnectionstring
cloudName=yourcloudinarycloudName
cloudKey=yourcloudinaryKey
cloudSecret=yourcloudinarysecret
SESSION_SECRET=yoursessionsecret
ENVIRONMENT=dev/staging/prod
```
Note that you can only use the three listed values for ENVIRONMENT.

You'll find your the cloudName, cloudKey and cloudSecret via the cloudinary console: 
<a href="https://cloudinary.com/console">https://cloudinary.com/console</a>. You need to creat a free account first. You need to make 3 folders: beers-dev, beers-staging and beers-prod.

<small>This API is using data of the punk API ("https://punkapi.com/")</small>

