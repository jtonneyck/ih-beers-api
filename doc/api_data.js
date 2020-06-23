define({ "api": [
  {
    "type": "post",
    "url": "/auth/login",
    "title": "Log in user",
    "name": "Login",
    "description": "<p>After logging a cookie is set and a session is maintained on the server. You have to enable cross-site access! If you use axios, you can enable it by setting withCredentials to true. Otherwise the cookie will not be set and the session will not be maintained on the server. Also bear in mind that you development front-end server should run on https. With CRA you should start your server with 'HTTPS=true npm start'. Otherwise the cookie will not be set. This API is build to work with a SPA. Therefore there's no server side redirect.</p>",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Mandatory username. The same field can also contain an email address, but still has to be called 'username'.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Mandatory.</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Oeeeps, something went wrong.\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\nset-cookie: connect.sid=s%3A0VMqqYBK3LGMKoKeeP8ntme0ZqT2rW95.2LmE%2BkYoa9khWbw7yBPJLHzxrF6b%2FDQhsraFNF%2FIvc8; Path=/; HttpOnly\n   {\n      \"username\": \"MasterBrew\",\n      \"id\": \"5d4d3bfc720fb89b71e013cf\",\n      \"firstname\": \"Jurgen\",\n      \"lastname\": \"Tonneyck\",\n      \"email\": \"Jurgen.Tonneyck@ironhack.com\",\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/auth/logout",
    "title": "Log out user",
    "name": "Logout",
    "group": "Auth",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Oeeeps, something went wrong.\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 205 Reset Content",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/signup",
    "title": "Sign up user",
    "name": "Signup",
    "group": "Auth",
    "description": "<p>After signing up the user is automatically logged in by setting a cookie and maintaining a session server side. This API is build to work with a SPA. Therefore there's no server side redirect. You have to enable cross-site access! If you use axios, you can enable it by setting withCredentials to true. Otherwise the cookie will not be set and the session will not be maintained on the server. Also bear in mind that you development front-end server should run on https. With CRA you should start your server with 'HTTPS=true npm start'. Otherwise the cookie will not be set.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Mandatory username. Has to be unique.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Mandatory firstname of user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Mandatory lastname of user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Mandatory email address of user. Has to be unique.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Mandatory. Minimum eight characters, at least one letter and one number.</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"message\": \"user validation failed: ...\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Oeeeps, something went wrong.\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\nset-cookie: connect.sid=s%3A0VMqqYBK3LGMKoKeeP8ntme0ZqT2rW95.2LmE%2BkYoa9khWbw7yBPJLHzxrF6b%2FDQhsraFNF%2FIvc8; Path=/; HttpOnly\n   {\n      \"username\": \"MasterBrew\",\n      \"id\": \"5d4d3bfc720fb89b71e013cf\",\n      \"firstname\": \"Jurgen\",\n      \"lastname\": \"Tonneyck\",\n      \"email\": \"Jurgen.Tonneyck@ironhack.com\",\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/beers/delete/:id",
    "title": "Delete a beer",
    "name": "Delete_a_beer",
    "group": "Beers",
    "description": "<p>You can only delete beers that are either created by unregistered users or have been created by yourself.</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 205 Reset Content\n[{\n   \"image_url\": \"https://images.punkapi.com/v2/2.png\",\n   \"_id\": \"5d4d3bfc720fb89b71e013cf\",\n   \"name\": \"Trashy Blonde\",\n   \"tagline\": \"You Know You Shouldn't\",\n   \"first_brewed\": \"04/2008\",\n   \"description\": \"A titillating, neurotic, peroxide punk of a Pale Ale. Combining attitude, style, substance, and a little bit of low self esteem for good measure; what would your mother say? The seductive lure of the sassy passion fruit hop proves too much to resist. All that is even before we get onto the fact that there are no additives, preservatives, pasteurization or strings attached. All wrapped up with the customary BrewDog bite and imaginative twist.\",\n   \"attenuation_level\": 76,\n}, {\n ...\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Oeeeps, something went wrong.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Unauthorized \n{\n  \"message\": \"\"We don't know you, guy.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden \n{\n  \"message\": \"This is not your beer, pal!.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not found\n{\n  \"message\": \"There's no such beer, buddy.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad request\n{\n  \"message\": \"That's not an object id, friend.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/beers/delete.js",
    "groupTitle": "Beers"
  },
  {
    "type": "post",
    "url": "/beers/new",
    "title": "Post a new beer",
    "name": "createBeer",
    "group": "Beers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tagline",
            "description": "<p>Mandatory tagline of the Beer.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Mandatory description of the Beer.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date/String",
            "optional": false,
            "field": "first_brewed",
            "description": "<p>Mandatory date of first brew of Beer. String in Date format: YYYY or YYYY-MM or YYYY-MM-DD.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "attenuation_level",
            "description": "<p>Mandatory level of attenuation.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "brewers_tips",
            "description": "<p>Mandatory tips of the brewer.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contributed_by",
            "description": "<p>Mandatory name of the brewer.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Mandatory name of Beer. It has to be unique.</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "picture",
            "description": "<p>Optional. Picture has to be a png or jpg. If provided, set mimetype to multipart/form-data. If not provided, the default picture will be &quot;https://images.punkapi.com/v2/2.png&quot;.</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"message\": \"beer validation failed: ...\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Oeeeps, something went wrong.\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"image_url\": \"https://images.punkapi.com/v2/2.png\",\n   \"_id\": \"5d4d3bfc720fb89b71e013cf\",\n   \"name\": \"Trashy Blonde\",\n   \"tagline\": \"You Know You Shouldn't\",\n   \"first_brewed\": \"04/2008\",\n   \"description\": \"A titillating, neurotic, peroxide punk of a Pale Ale. Combining attitude, style, substance, and a little bit of low self esteem for good measure; what would your mother say? The seductive lure of the sassy passion fruit hop proves too much to resist. All that is even before we get onto the fact that there are no additives, preservatives, pasteurization or strings attached. All wrapped up with the customary BrewDog bite and imaginative twist.\",\n   \"attenuation_level\": 76,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/beers/new.js",
    "groupTitle": "Beers"
  },
  {
    "type": "post",
    "url": "/beers/edit/:beerId",
    "title": "Edit a Beer",
    "name": "editBeer",
    "group": "Beers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tagline",
            "description": "<p>Optional tagline of the Beer.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Optional description of the Beer.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date/String",
            "optional": false,
            "field": "first_brewed",
            "description": "<p>Optional date of first brew of Beer. String in Date format: YYYY or YYYY-MM or YYYY-MM-DD.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "attenuation_level",
            "description": "<p>Optional level of attenuation.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "brewers_tips",
            "description": "<p>Optional tips of the brewer.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contributed_by",
            "description": "<p>Optional name of the brewer.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Optional name of Beer. It has to be unique.</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "picture",
            "description": "<p>Optional. Picture has to be a png or jpg. If provided, set mimetype to multipart/form-data. The old picture will be removed if a new one is chosen.</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"message\": \"beer validation failed: ...\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Oeeeps, something went wrong.\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"image_url\": \"https://images.punkapi.com/v2/2.png\",\n   \"_id\": \"5d4d3bfc720fb89b71e013cf\",\n   \"name\": \"Trashy Blonde\",\n   \"tagline\": \"You Know You Shouldn't\",\n   \"first_brewed\": \"04/2008\",\n   \"description\": \"A titillating, neurotic, peroxide punk of a Pale Ale. Combining attitude, style, substance, and a little bit of low self esteem for good measure; what would your mother say? The seductive lure of the sassy passion fruit hop proves too much to resist. All that is even before we get onto the fact that there are no additives, preservatives, pasteurization or strings attached. All wrapped up with the customary BrewDog bite and imaginative twist.\",\n   \"attenuation_level\": 76,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/beers/edit.js",
    "groupTitle": "Beers"
  },
  {
    "type": "get",
    "url": "/beers",
    "title": "Get all beers",
    "name": "getAllBeers",
    "group": "Beers",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n   \"image_url\": \"https://images.punkapi.com/v2/2.png\",\n   \"_id\": \"5d4d3bfc720fb89b71e013cf\",\n   \"name\": \"Trashy Blonde\",\n   \"tagline\": \"You Know You Shouldn't\",\n   \"first_brewed\": \"04/2008\",\n   \"description\": \"A titillating, neurotic, peroxide punk of a Pale Ale. Combining attitude, style, substance, and a little bit of low self esteem for good measure; what would your mother say? The seductive lure of the sassy passion fruit hop proves too much to resist. All that is even before we get onto the fact that there are no additives, preservatives, pasteurization or strings attached. All wrapped up with the customary BrewDog bite and imaginative twist.\",\n   \"attenuation_level\": 76,\n   \"contributed_by\": \"Jurgen\"\n}, {\n ...\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Oeeeps, something went wrong.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/beers/beers.js",
    "groupTitle": "Beers"
  },
  {
    "type": "get",
    "url": "/beers/:id",
    "title": "Get a single beer",
    "name": "getOneBeer",
    "group": "Beers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>unique Beer ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"image_url\": \"https://images.punkapi.com/v2/2.png\",\n   \"_id\": \"5d4d3bfc720fb89b71e013cf\",\n   \"name\": \"Trashy Blonde\",\n   \"tagline\": \"You Know You Shouldn't\",\n   \"first_brewed\": \"04/2008\",\n   \"description\": \"A titillating, neurotic, peroxide punk of a Pale Ale. Combining attitude, style, substance, and a little bit of low self esteem for good measure; what would your mother say? The seductive lure of the sassy passion fruit hop proves too much to resist. All that is even before we get onto the fact that there are no additives, preservatives, pasteurization or strings attached. All wrapped up with the customary BrewDog bite and imaginative twist.\",\n   \"attenuation_level\": 76,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"message\": \"Not Found.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Oeeeps, something went wrong.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/beers/detail.js",
    "groupTitle": "Beers"
  },
  {
    "type": "get",
    "url": "/beers/random",
    "title": "Get a random beer",
    "name": "getRandomBeer",
    "group": "Beers",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"image_url\": \"https://images.punkapi.com/v2/2.png\",\n   \"_id\": \"5d4d3bfc720fb89b71e013cf\",\n   \"name\": \"Trashy Blonde\",\n   \"first_brewed\": \"04/2008\",\n   \"description\": \"A titillating, neurotic, peroxide punk of a Pale Ale. Combining attitude, style, substance, and a little bit of low self esteem for good measure; what would your mother say? The seductive lure of the sassy passion fruit hop proves too much to resist. All that is even before we get onto the fact that there are no additives, preservatives, pasteurization or strings attached. All wrapped up with the customary BrewDog bite and imaginative twist.\",\n   \"attenuation_level\": 76,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Oeeeps, something went wrong.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/beers/random.js",
    "groupTitle": "Beers"
  },
  {
    "type": "get",
    "url": "/beers/search?q=beer",
    "title": "Get searched beers",
    "name": "searchBeer",
    "group": "Beers",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n   \"image_url\": \"https://images.punkapi.com/v2/2.png\",\n   \"_id\": \"5d4d3bfc720fb89b71e013cf\",\n   \"name\": \"Trashy Blonde\",\n   \"tagline\": \"You Know You Shouldn't\",\n   \"first_brewed\": \"04/2008\",\n   \"description\": \"A titillating, neurotic, peroxide punk of a Pale Ale. Combining attitude, style, substance, and a little bit of low self esteem for good measure; what would your mother say? The seductive lure of the sassy passion fruit hop proves too much to resist. All that is even before we get onto the fact that there are no additives, preservatives, pasteurization or strings attached. All wrapped up with the customary BrewDog bite and imaginative twist.\",\n   \"attenuation_level\": 76,\n},\n {\n   \"image_url\": ...\n  }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"message\": \"Not Found.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Oeeeps, something went wrong.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/beers/search.js",
    "groupTitle": "Beers"
  },
  {
    "type": "post",
    "url": "/user/profile/edit",
    "title": "Edit profile",
    "name": "Edit_profile",
    "description": "<p>All user routes are protected. The user should be logged in first.</p>",
    "group": "user",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Optional. username. Has to be unique.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Optional. firstname of user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Optional. lastname of user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Optional. email address of user. Has to be unique.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Optional. Minimum eight characters, at least one letter and one number.</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"message\": \"user validation failed: ...\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Oeeeps, something went wrong.\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n   {\n      \"username\": \"MasterBrew\",\n      \"id\": \"5d4d3bfc720fb89b71e013cf\",\n      \"firstname\": \"Jurgen\",\n      \"lastname\": \"Tonneyck\",\n      \"email\": \"Jurgen.Tonneyck@ironhack.com\",\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "user"
  },
  {
    "type": "get",
    "url": "/user/my-beers",
    "title": "Get my beers",
    "name": "My_beers",
    "description": "<p>All user routes are protected. The user should be logged in first.</p>",
    "group": "user",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Oeeeps, something went wrong.\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n   [{\n      \"image_url\": \"https://images.punkapi.com/v2/2.png\",\n      \"_id\": \"5d4d3bfc720fb89b71e013cf\",\n      \"name\": \"Trashy Blonde\",\n      \"tagline\": \"You Know You Shouldn't\",\n      \"first_brewed\": \"04/2008\",\n      \"description\": \"A titillating, neurotic, peroxide punk of a Pale Ale. Combining attitude, style, substance, and a little bit of low self esteem for good measure; what would your mother say? The seductive lure of the sassy passion fruit hop proves too much to resist. All that is even before we get onto the fact that there are no additives, preservatives, pasteurization or strings attached. All wrapped up with the customary BrewDog bite and imaginative twist.\",\n      \"attenuation_level\": 76,\n      \"owner\": \"5d4d3bfc720fb89b71e013cf\"\n   }, {\n    ...\n   }]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "user"
  },
  {
    "type": "get",
    "url": "/user/profile",
    "title": "Get profile",
    "name": "Profile",
    "description": "<p>All user routes are protected. The user should be logged in first.</p>",
    "group": "user",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Oeeeps, something went wrong.\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n   {\n      \"username\": \"MasterBrew\",\n      \"id\": \"5d4d3bfc720fb89b71e013cf\",\n      \"firstname\": \"Jurgen\",\n      \"lastname\": \"Tonneyck\",\n      \"email\": \"Jurgen.Tonneyck@ironhack.com\",\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "user"
  }
] });
