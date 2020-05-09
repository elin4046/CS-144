class Error {
  constructor(statusCode, message) {
    this.statusCode = statusCode;
    switch (statusCode) {
      case 404:
        this.statusCodeDescription = "Not Found";
        break;
      case 400:
        this.statusCodeDescription = "Bad Request";
        break;
      case 401:
        this.statusCodeDescription = "Unauthorized";
        break;
      case 500:
        this.statusCodeDescription = "Internal Server Error";
        break;
      case 200:
        this.statusCodeDescription = "OK";
        break;
    }
    this.message = message;
  }
}

module.exports = Error;
