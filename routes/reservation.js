const express = require("express");
const {
  getReservations,
  getReservation,
  addReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservation");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: API endpoints for restaurant reservations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - user
 *         - restaurant
 *         - reservationTime
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the reservation
 *         user:
 *           type: string
 *           description: The ID of the user making the reservation
 *         restaurant:
 *           type: string
 *           description: The ID of the restaurant being reserved
 *         reservationTime:
 *           type: string
 *           description: The time of the reservation
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of reservation creation
 *       example:
 *         id: "60d21b4667d0d8992e610c85"
 *         user: "60d21b9967d0d8992e610c87"
 *         restaurant: "60d21bf967d0d8992e610c89"
 *         reservationTime: "2025-03-01T18:30:00.000Z"
 *         createdAt: "2025-02-18T12:00:00.000Z"
 */

/**
 * @swagger
 * /reservation:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations
 */
router.get("/", protect, getReservations);

/**
 * @swagger
 * /reservation:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 */
router.post("/", protect, authorize("user", "admin"), addReservation);

/**
 * @swagger
 * /reservation/{id}:
 *   get:
 *     summary: Get a single reservation by ID
 *     tags: [Reservations]
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
 *         description: A single reservation object
 */
router.get("/:id", protect, authorize("user", "admin"), getReservation);

/**
 * @swagger
 * /reservation/{id}:
 *   put:
 *     summary: Update an existing reservation
 *     tags: [Reservations]
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
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 */
router.put("/:id", protect, authorize("user", "admin"), updateReservation);

/**
 * @swagger
 * /reservation/{id}:
 *   delete:
 *     summary: Delete a reservation
 *     tags: [Reservations]
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
 *         description: Reservation deleted successfully
 */
router.delete("/:id", protect, authorize("user", "admin"), deleteReservation);

module.exports = router;
