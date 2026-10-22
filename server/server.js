require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const app = express();

/*

# DATABASE

*/

connectDB();

/*

CORS

*/
const allowedOrigins = [
"https://nova-ecommerce-mu.vercel.app",
"http://localhost:5173",
"http://localhost:5174",
"http://localhost:5175",
"http://localhost:5176",

"http://127.0.0.1:5173",
"http://127.0.0.1:5174",
"http://127.0.0.1:5175",
"http://127.0.0.1:5176",
];

app.use(
cors({
origin: function (origin, callback) {
/*
Allow requests without an origin,
such as Postman, PowerShell, or
server-to-server requests.
*/


  if (!origin) {
    return callback(null, true);
  }

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  console.log(
    "CORS blocked origin:",
    origin
  );

  return callback(
    new Error(
      `CORS blocked request from: ${origin}`
    )
  );
},

credentials: true,


})
);

/*

 BODY PARSING

*/

app.use(express.json());

app.use(
express.urlencoded({
extended: true,
})
);

/*

 HEALTH CHECK

*/

app.get("/api/health", (req, res) => {
res.json({
success: true,
message: "NOVA API is running.",
});
});

 /*

# API ROUTES

*/

app.use(
"/api/auth",
authRoutes
);

/*
IMPORTANT:
The frontend calls:

/api/payment/verify/:reference

Therefore the payment router must be mounted
at /api/payment, not /api/payments.
*/

app.use(
"/api/payment",
paymentRoutes
);

app.use(
"/api/orders",
orderRoutes
);

app.use(
  "/api/admin/orders",
  adminOrderRoutes
);


 /*

 404 HANDLER

*/

app.use((req, res) => {
res.status(404).json({
success: false,
message: "Route not found.",
});
});

 /*

 GLOBAL ERROR HANDLER

*/

app.use(
(error, req, res, next) => {
console.error(
"Server error:",
error.message
);


res.status(500).json({
  success: false,
  message:
    error.message ||
    "Internal server error.",
});


}
);

 /*

 SERVER

*/

const PORT =
process.env.PORT || 5001;

app.listen(PORT, () => {
console.log(
`NOVA API running on http://localhost:${PORT}`
);
});
