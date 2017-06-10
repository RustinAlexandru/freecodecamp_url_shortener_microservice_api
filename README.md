# Freecodecamp Url Shortener Microservice Api

User stories:

  1. I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
  2. If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
  When I visit that shortened URL, it will redirect me to my original link.

Example usage:

    https://ralex-url-shortener.herokuapp.com/newShortUrl/https://www.google.com
    https://ralex-url-shortener.herokuapp.com/newShortUrl/http://foo.com:80

Example output:

    {"original_url":"http://foo.com:80","short_url":"https://ralex-url-shortener.herokuapp.com/8170"}

Usage:

    https://ralex-url-shortener.herokuapp.com/8170

Will redirect to:

    http://foo.com:80
