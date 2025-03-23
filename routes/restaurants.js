const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const reservationRoute = require("./reservation");

const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurant");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: API endpoints for restaurant management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - tel
 *         - openTime
 *         - closeTime
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the restaurant
 *         name:
 *           type: string
 *           description: The restaurant's name
 *         address:
 *           type: string
 *           description: The restaurant's address
 *         tel:
 *           type: string
 *           description: The restaurant's contact number
 *         openTime:
 *           type: string
 *           description: Opening time
 *         closeTime:
 *           type: string
 *           description: Closing time
 *         picture:
 *           type: string
 *           description: URL of the restaurant's image
 *       example:
 *         id: "60d21b4667d0d8992e610c85"
 *         name: "Pizza Palace"
 *         address: "123 Main St, City, Country"
 *         tel: "123-456-7890"
 *         openTime: "10:00 AM"
 *         closeTime: "10:00 PM"
 *         picture: "https://example.com/pizza.jpg"
 */

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 */
router.get("/", getRestaurants);

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 */
router.post("/", protect, authorize("admin"), createRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Get a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single restaurant object
 */
router.get("/:id", getRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: Update a restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 */
router.put("/:id", protect, authorize("admin"), updateRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 */
router.delete("/:id", protect, authorize("admin"), deleteRestaurant);

// Include reservations under a specific restaurant
router.use("/:restaurantID/reservation", reservationRoute);

module.exports = router;
