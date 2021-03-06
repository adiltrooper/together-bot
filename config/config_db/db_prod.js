module.exports = {
  connectionlimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  cloudinary_cloudname: process.env.CLOUDINARY_CLOUDNAME,
  cloudinary_apikey: process.env.CLOUDINARY_APIKEY,
  cloudinary_secret: process.env.CLOUDINARY_SECRET,
  multipleStatements: true
};
