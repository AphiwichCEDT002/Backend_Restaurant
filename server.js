const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// load env var
dotenv.config({path:'./config/config.env'});

connectDB();

const allowedOrigins = [
  'http://localhost:3000',
  'https://thorn-mod-restaurant.vercel.app'
];

const app = express();
const restaurants = require('./routes/restaurants');
const auth = require('./routes/auth');
const reservation = require('./routes/reservation');
app.use(cors({
  origin: function (origin, callback) {
    console.log("🔍 Request from origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ Not allowed by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/restaurants',restaurants)
app.use('/api/v1/auth',auth);
app.use('/api/v1/reservation',reservation);





const PORT = process.env.PORT || 5001;
const server = app.listen(
  PORT,
  console.log(
    "Server running in",
    process.env.NODE_ENV,
    "on http://localhost:" + PORT
  )
);

const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Restaurant Booking API",
        version: "1.0.0",
        description: "API for restaurant reservations",
      },
      servers: [
        {
          url: "https://thorn-mod-restaurant.vercel.app/api/v1",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["./routes/*.js"],
  };


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});