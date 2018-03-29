const host = process.env.HOST || "localhost";
const env = process.env.NODE_ENV || "development";
const conf = require(`./${env}`).default;
export default Object.assign(
  {
    env,
    host
  },
  conf
);
