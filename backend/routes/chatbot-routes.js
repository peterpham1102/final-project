const express = require("express");

const { check } = require("express-validator");
const chatbotControllers = require("../controllers/chatbot-controllers");
const checkAuthen = require('../middleware/check-authen');
const router = express.Router();


router.use(checkAuthen);
router.post("/df_text_query", chatbotControllers.textQuery);
router.post("/df_event_query", chatbotControllers.eventQuery);
router.get("/get_client_token", chatbotControllers.getToken);
router.post("/fulfillment", chatbotControllers.testFulfill);

module.exports = router;