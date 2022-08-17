const hostname = window.location.hostname;
export default {
  SERVER_URL:
    hostname == "localhost"
      ? "http://localhost:5000/api/v1"
      : "http://54.184.181.135:5000/api/v1",
};
