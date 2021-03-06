'use strict';

var IPRetriever = require('./ip_retriever');
var HTTPGet = require('./http_get')

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};


/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    var cardTitle = "Update Smart DNS Proxy"
    var speechOutput = "You can update Smart DNS Proxy, to update to your current IP address"
    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, ""));
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == 'update') {
        handleTestRequest(intent, session, callback);
    }
    else {
        throw "Invalid intent";
    }
}


function handleTestRequest(intent, session, callback) {
    
    var succesfulCompletion = function() {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Successfully updated", ""))        
    }
    var errorCompletion = function() {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Errir Updating", ""))        
    }
    
    var executeCallback = function(result) {
	console.log('Resolved ip to: ' + result)
	new HTTPGet().executeHttpGet('https://httpbin.org/get?ip=' + result, succesfulCompletion, errorCompletion)
}


	console.log('Calling ip')
	new IPRetriever().getIpAddress('fergusb.dyndns.org', executeCallback);
}

// ------- Helper functions to build responses -------

function buildSpeechletResponse(title, output, repromptText) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        }
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: true
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}


