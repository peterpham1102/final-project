const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

const Store = require("../models/store");
const Food = require('../models/food');
const Order = require('../models/order');
const User = require('../models/user');

const { struct } = require('pb-util');
const structjson = require('../util/chatbot/structjson');

const dialogflow = require("dialogflow");
const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const config = require('../util/chatbot/config/keys');


const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;
const googleAuth = require('google-oauth-jwt');

const credentials = {
  client_email: config.googleClientEmail,
  private_key:
    config.googlePrivateKey,
};


const sessionClient = new dialogflow.SessionsClient({ projectId, credentials });
// const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const textQuery = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];


  // let self = module.exports;
  const sessionPath = sessionClient.sessionPath(projectId, sessionId + req.userData.userId);
  const {
    text,
    parameters
  } = req.body

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: languageCode,
      },
    },
    queryParams: {
      payload: {
        data: parameters,
      }
    }

  };
  let responses = await sessionClient.detectIntent(request);
  // responses = await self.handleAction(responses);
  // res.send(responses[0].queryResult)
  responses = await handleAction(responses);
  res.json({
    result: responses[0].queryResult,
  })
}

const eventQuery = async (req, res, next) => {
  // let self = module.exports;

  let sessionPath = sessionClient.sessionPath(projectId, sessionId + req.userData.userId);
  const { event, parameters } = req.body


  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        name: event,
        parameters: structjson.jsonToStructProto(parameters), //Dialogflow's v2 API uses gRPC. You'll need a jsonToStructProto method to convert your JavaScript object to a proto struct.
        // parameters: struct.encode(parameters),
        languageCode: languageCode,
      },
    }
  };

  let responses = await sessionClient.detectIntent(request);
  // responses = self.handleAction(responses);
  responses = handleAction(responses);
  // return responses;

  res.json({
    result: responses[0].queryResult
  })
}

const handleAction = (responses) => {
  // let self = module.exports;
  let queryResult = responses[0].queryResult;

  switch (queryResult.action) {
    case 'recommend-foods-yes':
      if (queryResult.allRequiredParamsPresent) {
        // self.saveRegistration(queryResult.parameters.fields);
        creatOrder(queryResult.parameters.fields);
      }
      break;
  }

  return responses;
}

const creatOrder = async (fields) => {


}

const getToken = async () => {
  return new Promise((resolve) => {
    googleAuth.authenticate(
      {
        email: config.googleClientEmail,
        key: config.googlePrivateKey,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      },
      (err, token) => {
        resolve(token);
      },
    );
  });
}

const testFulfill = async (req, res, next) => {
  const agent = new WebhookClient({ request: req, response: res });
  function helloTai(agent) {
    agent.add(`Fulfillment here dmm`)
  }

  async function recommendFoods(agent) {
    const quick_replies = 
      {
        "quick_replies": [
            {
              "text": "yes",
              "payload": "order_yes"
            },
            {
              "text": "no",
              "payload": "order_no"
            },
            {
              "text": "else",
              "payload": "order_else"
            }
            
            
            ]
      }
    let foods;
    foods = await Food.find().sort({ orders_count: -1 }).populate('store_id')
    foods.map((food) => food.toObject()).slice(0, 5)
    const foodRecommend = foods[Math.floor(Math.random() * foods.length)]
    const response = {
      cards: [{
        key: foodRecommend.id,
        header: foodRecommend.name,
        link: foodRecommend.store_id,
        price: foodRecommend.price,
        image: foodRecommend.image,
        description: foodRecommend.description
      },
    ],
    quick_replies: quick_replies   
    };
    
    agent.add(`Here is your food`)
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true }));
    // agent.add(`Herer is your link: ${link}`)
    // agent.add(new Payload(agent.UNSPECIFIED, quick_replies, { rawPayload: true, sendAsMessage: true }))
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  let intentMap = new Map();
  intentMap.set('test-fulfillment', helloTai);
  intentMap.set('recommend-foods', recommendFoods);
  intentMap.set('Default Fallback intent', fallback);
  agent.handleRequest(intentMap);
}










exports.getToken = getToken;
exports.textQuery = textQuery;
exports.eventQuery = eventQuery;
exports.handleAction = handleAction
exports.testFulfill = testFulfill