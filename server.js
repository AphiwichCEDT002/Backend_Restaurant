const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const serverless = require('serverless-http'); // 👈 สำคัญ

dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://thorn-mod-restaurant.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("🌍 CORS Origin:", origin); // debug
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
 // ✅ Handle preflight
app.use(express.json());
app.use(cookieParser());

// Routes
const restaurants = require('./routes/restaurants');
const auth = require('./routes/auth');
const reservation = require('./routes/reservation');

app.use('/api/v1/restaurants', restaurants);
app.use('/api/v1/auth', auth);
app.use('/api/v1/reservation', reservation);

// Swagger
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
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      }
    ]
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// ✅ สำคัญ: export ด้วย serverless-http
module.exports = serverless(app);
