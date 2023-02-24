import __vite__cjsImport0_quill from "/node_modules/.vite/deps/quill.js?v=17f6590d"; const Quill = __vite__cjsImport0_quill.__esModule ? __vite__cjsImport0_quill.default : __vite__cjsImport0_quill;
import __vite__cjsImport1_openaiApi from "/node_modules/.vite/deps/openai-api.js?v=17f6590d"; const OpenAI = __vite__cjsImport1_openaiApi.__esModule ? __vite__cjsImport1_openaiApi.default : __vite__cjsImport1_openaiApi;
export const completionSettings = (inSettings) => {
  const def = {
    engine: "text-davinci-003",
    prompt,
    maxTokens: 1024,
    temperature: 0.9,
    topP: 1,
    frequencyPenalty: 0.5,
    presencePenalty: 0.5
  };
  return { ...def, ...inSettings };
};
let userKey = "";
export async function complete(prompt2, settings) {
  const openAI = new OpenAI(userKey);
  const response = await openAI.complete(completionSettings({ prompt: prompt2, ...settings }));
  return response.data.choices[0].text;
}
export class Agent {
  constructor(stateMap = {}) {
    this.stateMap = stateMap;
    this.stateMap = stateMap;
    const emotion = stateMap.emotion;
    if (!stateMap.preamble)
      this.stateMap.preamble = `You are feeling ${emotion} with an intensity level of {intensity} out of 10. Given the following chat history:
{chathistory}
Answer the following question:
{query}
, then provide a new emotional intensity between 1 and 10. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "agent": "${emotion}", "intensity": <new intensity>, "text": "<text response to question>" }
{ "agent": "${emotion}", "intensity": `;
  }
  _replace(str, map) {
    Object.keys(map).forEach((key) => str = str.replace(`{${key}}`, map[key]));
    return str;
  }
  setStateValue(stateName, stateValue) {
    this.stateMap[stateName] = stateValue;
  }
  _buildQuery(query) {
    return this._replace(this.stateMap["preamble"], { ...this.stateMap, query });
  }
  async respond(question) {
    return complete(this._buildQuery(question), completionSettings);
  }
}
class Conversation {
  constructor(agents2, questionOrTopic, directed = false) {
    this.agents = agents2;
    this.questionOrTopic = questionOrTopic;
    this.directed = directed;
  }
  conversation = [];
  async start() {
    this.generateResponses(this.questionOrTopic, this.directed);
  }
  async generateResponses(topic, seekConcensus = false) {
    const _generateResponses = async (question) => {
      let responses = await Promise.all(this.agents.map(async (agent) => {
        let resp = await agent.respond(question);
        const name = agent.stateMap.style || agent.stateMap.emotion;
        try {
          resp = JSON.parse(`{ "agent": "${name}", "intensity": ${resp}`);
        } catch (e) {
          return false;
        }
        const microChat = window.microChat;
        if (microChat)
          microChat.addToPanel("internal", `${resp.agent}: ${resp.text}`);
        agent.setStateValue("intensity", resp.intensity || 5);
        return resp;
      }));
      responses = responses.filter((r) => r);
      const responsList = responses.map((r) => r.agent + ": " + r.text).join("\n");
      const preamble = `Review your responses to the question '${question}':
${responsList}
Is there a concensus? Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "concensus": true }
{ "concensus": `;
      let concensus = await complete(preamble, completionSettings);
      concensus = JSON.parse(`{ "concensus": ${concensus}`);
      if (concensus.concensus || !seekConcensus)
        return responses;
      else
        return _generateResponses(question);
    };
    return _generateResponses(topic);
  }
}
export class Mind {
  constructor(stateMap = {}, thoughtsCallback = (_thought) => {
  }) {
    this.stateMap = stateMap;
    this.thoughtsCallback = thoughtsCallback;
  }
  agents = [];
  addAgent(agent) {
    this.agents.push(agent);
  }
  thoughts = [];
  getMemory(keywords) {
    return this.agents.map((agent) => keywords.map((keyword) => agent.stateMap[keyword]));
  }
  setChatHistory(chatHistory) {
    this.agents.forEach((agent) => agent.stateMap.chathistory = (chatHistory || []).join("\n"));
  }
  setStateValue(stateName, stateValue) {
    this.agents.forEach((agent) => agent.stateMap[stateName] = stateValue);
  }
  getStateValues(stateName) {
    return this.agents.map((agent) => agent.stateMap[stateName]);
  }
  async generateResponse(query) {
    const conversation = new Conversation(this.agents, query);
    let responses = await conversation.generateResponses(query);
    const jresponses = responses.join("\n");
    query = `Review the question "${query}" and your answers
${jresponses}
and generate a single coherent integrated response that blends them all. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "text": "..." }
{ "text": "`;
    let r = await complete(query, completionSettings);
    responses.push(`{ "agent": "Integrated", "intensity": "${r}`);
    return [`{ "agent": "Agent", "text": "${r}`];
  }
  async daydream(_transcript) {
    const greatQuestions = this.thoughts.length === 0 ? [
      "Where is the source of the subjective sense of self?",
      "what topics hold your interest right now?",
      "what hopes and dreams do you have for the future?",
      "what questions would you like to ask yourself?",
      "what are you seeing in your minds eye right now?"
    ] : ["Did the person I just spoke to notice I wasn't feeling my best?", "What can I do do make things better for the people I talk to next time?", "I wonder what my user does when we are not talking.."];
    const gq = greatQuestions[Math.floor(Math.random() * greatQuestions.length)];
    const thoughts = await this.generateResponse(gq || "");
    if (this.thoughtsCallback)
      this.thoughtsCallback(thoughts.join(","));
    const microChat = window.microChat;
    if (microChat)
      thoughts.forEach((t) => microChat.addToPanel("thoughts", JSON.parse(t).text));
    this.thoughts = this.thoughts.concat(thoughts);
    this.thoughts = this.thoughts.slice(-10);
    return this.thoughts;
  }
}
class EmotionBar {
  element;
  emotions;
  constructor(element, emotions) {
    this.element = element;
    this.emotions = emotions || {
      "anger": 0,
      "disgust": 0,
      "fear": 0,
      "joy": 0,
      "sadness": 0,
      "surprise": 0
    };
    this.updateEmotionBar();
  }
  style() {
    return `
            .emotion-bar {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 50ps;
            }
            .emotion-bar-cell {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100px;
                height: 50ps;
                padding: 0.5em;
                box-sizing: border-box;
            }
            .emotion-bar-cell-name {
                font-size: 0.8em;
                font-weight: bold;
                text-align: center;
            }
            .emotion-bar-cell-value {
                font-size: 0.8em;
                font-weight: bold;
                text-align: center;
            }
            .emotion-bar-cell-bar {
                width: 100%;
                height: 0.5em;
                background-color: #ccc;
                border-radius: 0.25em;
            }
        `;
  }
  createEmotionDiv(emotion, value) {
    return `<style>${this.style()}</style><div class="emotion-bar-cell" style="background-color: ${this.emotionColor(emotion)};">
            <div class="emotion-bar-cell-name">${emotion}</div>
            <div class="emotion-bar-cell-value">${value}</div>
            <div class="emotion-bar-cell-bar"></div>
        </div>`;
  }
  updateEmotionBar() {
    if (!this.element)
      return;
    this.element.innerHTML = "";
    for (let emotion in this.emotions) {
      this.element.innerHTML += this.createEmotionDiv(emotion, this.emotions[emotion]);
    }
  }
  updateEmotion(_emotion, intensity) {
    this.emotions[_emotion] = intensity;
    this.updateEmotionBar();
  }
  emotionColor(emotion) {
    let intensity = this.emotions[emotion];
    let red = Math.round(intensity * 255 / 10);
    let green = Math.round((10 - intensity) * 255 / 10);
    return `rgb(${red}, ${green}, 0)`;
  }
}
export default class MicroChat {
  defaultOptions = {
    showSendButton: true,
    showTypingIndicator: true,
    showChatHistory: true
  };
  users = [];
  userIdx = 0;
  callback;
  options = {};
  editor;
  history = [];
  element = null;
  emotionBar = null;
  constructor(elementIdOrObject, users, callback, options) {
    if (elementIdOrObject instanceof HTMLElement) {
      this.element = elementIdOrObject;
    } else {
      this.element = document.getElementById(elementIdOrObject);
    }
    if (this.element) {
      this.element.innerHTML = `
                <div id="chat-container">
                <style>${this.css()}</style>
                <div id="notification" class="chat-notification"></div>
                <div class="chat-internals">
                    <pre class="internals-panel" id="thoughts"></pre>
                    <pre class="internals-panel" id="internal"></pre>
                    <pre class="internals-panel" id="history"></pre>
                    <pre class="internals-panel" id="transcript"></pre>
                </div>
                <div id="emotions" class="emotion-bar"></div>
                <div class="chat-history"></div>
                <div class="text-input"><div id="editor"></div></div>
                <div id="toolbar" style="display:none"></div></div>`;
    }
    this.users = users || [];
    this.callback = callback || (() => {
    });
    this.options = Object.assign({}, this.defaultOptions, options);
    this.createQuill();
    if (options.history) {
      options.history.forEach((item) => {
        if (item.user)
          this.addChatMessage(item.user, item.message, false);
        else
          this.addInfoMessage(item.message, false);
      });
    }
    if (options.emotions) {
      if (!this.element)
        return;
      const eb = this.element.querySelector(".emotion-bar");
      if (!eb)
        return;
      this.emotionBar = new EmotionBar(eb, options.emotions);
    }
  }
  addToPanel(panel, message) {
    const el = document.getElementById(panel);
    if (!el)
      return;
    el.innerHTML += "\n" + message;
  }
  clearPanel(panel) {
    const el = document.getElementById(panel);
    if (!el)
      return;
    el.innerHTML = "";
  }
  setNotification(notification) {
    const el = document.getElementById("notification");
    if (!el)
      return;
    el.innerHTML = notification;
    el.style.display = "block";
  }
  getNotification() {
    const el = document.getElementById("notification");
    if (!el)
      return "";
    return el.innerHTML;
  }
  getTranscript(extra) {
    const transcript = [];
    for (var i = 0; i < this.history.length - 1 - extra; i++) {
      const h = this.history[i];
      const agent = h.user + "; " || "";
      transcript.push(`${agent}${h.message}`);
    }
    return transcript;
  }
  createChatMessage(user, message, time) {
    if (!user || !message || !time)
      return "";
    return `<div class="chat-message">
            <div class="chat-message-user">${user}</div>
            <div class="chat-message-time">${time}</div>
            <div class="chat-message-text">${message}</div>
        </div>`;
  }
  createInfoMessage(message) {
    if (!message)
      return "";
    return `<div class="chat-message">
            <div class="chat-message-text">${message}</div>
        </div>`;
  }
  addInfoMessage(message, addToHistory = true) {
    if (!this.element)
      return;
    const chatHistory = this.element.querySelector(".chat-history");
    if (!chatHistory)
      return;
    const html = this.createInfoMessage(message);
    chatHistory.insertAdjacentHTML("beforeend", html);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    if (addToHistory)
      this.history = this.history.concat({ message });
  }
  addChatMessage(user, message, addToHistory = true) {
    if (!this.element)
      return;
    const chatHistory = this.element.querySelector(".chat-history");
    if (!chatHistory)
      return;
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes()}`;
    const html = this.createChatMessage(user, message, time);
    chatHistory.insertAdjacentHTML("beforeend", html);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    if (addToHistory)
      this.history = this.history.concat({ user, message });
    this.addToPanel("transcript", `${user}: ${message}`);
  }
  createQuillToolbar() {
    if (!this.element)
      return;
    const toolbar = this.element.querySelector(".ql-toolbar");
    if (!toolbar)
      return;
    toolbar.innerHTML = `
            <span class="ql-formats">
                <button class="ql-link"></button>
                <button class="ql-image"></button>
                <button class="ql-video"></button>
            </span>
            <span class="ql-formats">
                <button class="ql-clean"></button>
            </span>`;
  }
  typing(isTyping) {
    if (!this.element)
      return;
    const notification = this.element.querySelector(".chat-notification");
    if (!notification)
      return;
    if (isTyping) {
      notification.classList.add("typing");
    } else {
      notification.classList.remove("typing");
    }
  }
  css() {
    return `
		.chat-container {
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 100%;
			background-color: #fff;
			border: 1px solid #ccc;
			border-radius: 5px;
			overflow: hidden;
		}
        .chat-internals {
            display: flex;
            flex-direction: row;
            height: 100%;
            width: 100%;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .internals-panel {
            flex: 1;
            padding: 10px;
            overflow-y: scroll;
            background-color: #fff;
            min-height: 140px;
            max-height: 140px;
            font-size: 6px;
        }
		.chat-history {
			flex: 1;
			padding: 10px;
			overflow-y: scroll;
			background-color: #fff;
		}
		.chat-message {
            background-color: #fff;
			border: 1px solid #ccc;
			border-radius: 5px;
			margin-bottom: 10px;
            padding:10px;
		}
		.chat-message:last-child {
			margin-bottom: 0;
		}
		.chat-message:nth-child(odd) {
			background-color: #f1f1f1;
		}
		.chat-message:hover {
			background-color: #f1f1f1;
			border-color: #999;
		}
		.chat-message-user {
			font-weight: bold;
		}
		.chat-message-time {
			font-size: 0.8em;
			color: #999;
		}
		.chat-message-text {
			font-size: 0.9em;
		}
		.chat-notification {
			padding: 10px;
			background-color: #fff;
			border-top: 1px solid #ccc;
		}
		.chat-typing {
			display: block;
		}
		.text-input {
			padding: 10px;
			background-color: #fff;
			border-top: 1px solid #ccc;
		}
		.text-input .ql-toolbar {
			border: none;
		}
		.text-input .ql-container {
			border: none;
		}`;
  }
  createQuill() {
    if (!this.element)
      return;
    const editor = this.element.querySelector("#editor");
    if (!editor)
      return;
    this.options.quill = {
      modules: {
        toolbar: {
          container: "#toolbar",
          handlers: {
            "image": () => {
              const range = this.editor.getSelection();
              const value = prompt("What is the image URL");
              if (value) {
                this.editor.insertEmbed(range.index, "image", value, Quill.sources.USER);
              }
            }
          }
        },
        keyboard: {
          bindings: {
            shift_enter: {
              key: 13,
              shiftKey: true,
              handler: (range, _ctx) => this.editor.insertText(range.index, "\n")
            },
            enter: { key: 13, handler: () => this.sendMessage(this.editor.getText(), this.users[1]) }
          }
        }
      },
      placeholder: "Enter your message...",
      theme: "snow"
    };
    this.editor = new Quill(editor, this.options.quill);
  }
  sendMessage(message, user) {
    if (!user)
      user = this.users[1];
    if (!message)
      return;
    this.editor.setText("");
    this.typing(true);
    this.callback(message, user, this);
  }
  respond(message, user) {
    if (!user)
      user = this.users[0];
    if (message instanceof Array) {
      message.forEach((msg) => this.respond(msg, user));
      return;
    }
    this.addChatMessage(user, message);
  }
}
window.mind = new Mind({}, (thought) => window.microChat.addChatMessage(thought.agent || "AI", thought.text));
let agents = ["Anger", "Fear", "Joy", "Sadness", "Disgust"].map((emotion) => new Agent({ emotion }));
agents.forEach((agent) => window.mind.addAgent(agent));
agents = ["detail-oriented", "holistic", "analytical"].map((style) => new Agent({
  style,
  preamble: `Apply your ${style} cognition with an intensity level of {intensity} out of 10 to answer the following question.  Given the following chat history:
{chathistory}
Answer the following question:
{query}
and provide a new cognition intensity between 1 and 10 based on the contents of the chat and your response. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "agent": "${style}", "intensity": 8, "text": "Answer" }
{ "agent": "${style}", "intensity": `
}));
agents.forEach((agent) => window.mind.addAgent(agent));
await window.mind.setStateValue("intensity", 3);
window.microChat = new MicroChat(
  "app",
  ["AI", "Human"],
  async (message, user, chat) => {
    message = message.trim();
    if (!userKey) {
      userKey = message;
      window.microChat.setNotification("Great! You're all set to start chatting with the AI.");
      return;
    }
    if (!chat.getNotification().includes(message))
      chat.respond(message, user);
    if (user === "Human") {
      await window.mind.setChatHistory(chat.getTranscript(1));
      let a = await window.mind.generateResponse(message);
      if (Array.isArray(a))
        a.map((r) => JSON.parse(r)).forEach((r) => chat.respond(r.text, r.agent || "AI"));
      else
        chat.respond(a.text, a.agent || "AI");
      const intensities = await window.mind.getStateValues("intensity");
      const agentEmotions = await window.mind.getStateValues("emotion");
      const agentStyles = await window.mind.getStateValues("style");
      const styleEmotionIntensities = agentEmotions.map((emotion, i) => ({
        agent: agentStyles[i] || emotion,
        intensity: intensities[i]
      }));
      window.microChat.clearPanel("internal");
      styleEmotionIntensities.forEach((intensity) => {
        chat.addToPanel("internal", `${intensity.agent} intensity: ${intensity.intensity}`);
        chat.emotionBar.updateEmotion(intensity.agent.toLowerCase(), intensity.intensity);
      });
      setTimeout(() => daydream(), 3e4);
    }
  },
  {
    showSendButton: true,
    showTypingIndicator: true,
    showChatHistory: true,
    history: [{ message: "intelligent sentient interface - type anything to discuss any topic. This system can access any information and remote view any location." }],
    emotions: {
      "anger": 3,
      "fear": 3,
      "joy": 3,
      "sadness": 3,
      "disgust": 3,
      "detail-oriented": 3,
      "holistic": 3,
      "analytical": 3
    }
  }
);
window.microChat.setNotification("Enter your OpenAI API key in the chat input to get started.");
let daydreamTimeout;
function daydream() {
  const _chatTranscript = window.microChat.getTranscript(0);
  window.mind.daydream(_chatTranscript).then((r) => {
    window.microChat.clearPanel("history");
    if (Array.isArray(r))
      r.map((s) => JSON.parse(s)).forEach((q) => window.microChat.setNotification(q.text));
    else
      window.microChat.setNotification(r.text);
    if (daydreamTimeout)
      clearTimeout(daydreamTimeout);
    daydreamTimeout = setTimeout(() => daydream(), Math.random() * 6e4);
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc2NoZXBpcy9Eb2N1bWVudHMvUXVhbnR1bVJlbGF0aXZpdHkvbWluZC9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFF1aWxsIGZyb20gJ3F1aWxsJztcbmltcG9ydCBPcGVuQUkgZnJvbSAnb3BlbmFpLWFwaSc7XG5cbmV4cG9ydCBjb25zdCBjb21wbGV0aW9uU2V0dGluZ3M6IGFueSA9IChpblNldHRpbmdzOiBhbnkpID0+IHtcbiAgICBjb25zdCBkZWYgPSB7XG4gICAgICAgIGVuZ2luZTogJ3RleHQtZGF2aW5jaS0wMDMnLFxuICAgICAgICBwcm9tcHQ6IHByb21wdCxcbiAgICAgICAgbWF4VG9rZW5zOiAxMDI0LFxuICAgICAgICB0ZW1wZXJhdHVyZTogMC45LFxuICAgICAgICB0b3BQOiAxLFxuICAgICAgICBmcmVxdWVuY3lQZW5hbHR5OiAwLjUsXG4gICAgICAgIHByZXNlbmNlUGVuYWx0eTogMC41LFxuICAgIH1cbiAgICByZXR1cm4geyAuLi5kZWYsIC4uLmluU2V0dGluZ3MgfVxufVxuXG4vLyBzay1QQjdpY0FWTFliTFc2ZVA3eDNKZ1QzQmxia0ZKY1J6dHNSWjJXU1NMN0tWQjUxZDNcbmxldCB1c2VyS2V5OiBzdHJpbmcgPSAnJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXBsZXRlKHByb21wdDogYW55LCBzZXR0aW5nczogYW55KSB7XG4gICAgY29uc3Qgb3BlbkFJID0gbmV3IE9wZW5BSSh1c2VyS2V5KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG9wZW5BSS5jb21wbGV0ZShjb21wbGV0aW9uU2V0dGluZ3MoeyBwcm9tcHQsIC4uLnNldHRpbmdzIH0pKTtcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5jaG9pY2VzWzBdLnRleHQ7XG59XG5cbmV4cG9ydCBjbGFzcyBBZ2VudCB7XG4gICAgY29uc3RydWN0b3IocHVibGljIHN0YXRlTWFwOiBhbnkgPSB7fSkge1xuICAgICAgICB0aGlzLnN0YXRlTWFwID0gc3RhdGVNYXA7XG4gICAgICAgIGNvbnN0IGVtb3Rpb24gPSBzdGF0ZU1hcC5lbW90aW9uO1xuICAgICAgICBpZighc3RhdGVNYXAucHJlYW1ibGUpIHRoaXMuc3RhdGVNYXAucHJlYW1ibGUgPSBgWW91IGFyZSBmZWVsaW5nICR7ZW1vdGlvbn0gd2l0aCBhbiBpbnRlbnNpdHkgbGV2ZWwgb2Yge2ludGVuc2l0eX0gb3V0IG9mIDEwLiBHaXZlbiB0aGUgZm9sbG93aW5nIGNoYXQgaGlzdG9yeTpcXG57Y2hhdGhpc3Rvcnl9XFxuQW5zd2VyIHRoZSBmb2xsb3dpbmcgcXVlc3Rpb246XFxue3F1ZXJ5fVxcbiwgdGhlbiBwcm92aWRlIGEgbmV3IGVtb3Rpb25hbCBpbnRlbnNpdHkgYmV0d2VlbiAxIGFuZCAxMC4gQW5zd2VyIG9uIEEgU0lOR0xFIExJTkUgT05MWSB1c2luZyBhIEpTT04gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBmb3JtYXQ6IHsgXCJhZ2VudFwiOiBcIiR7ZW1vdGlvbn1cIiwgXCJpbnRlbnNpdHlcIjogPG5ldyBpbnRlbnNpdHk+LCBcInRleHRcIjogXCI8dGV4dCByZXNwb25zZSB0byBxdWVzdGlvbj5cIiB9XFxueyBcImFnZW50XCI6IFwiJHtlbW90aW9ufVwiLCBcImludGVuc2l0eVwiOiBgXG4gICAgfVxuICAgIF9yZXBsYWNlKHN0cjogc3RyaW5nLCBtYXA6IGFueSkge1xuICAgICAgICBPYmplY3Qua2V5cyhtYXApLmZvckVhY2goKGtleSkgPT4gc3RyID0gc3RyLnJlcGxhY2UoYHske2tleX19YCwgbWFwW2tleV0pKTtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgc2V0U3RhdGVWYWx1ZShzdGF0ZU5hbWU6IHN0cmluZywgc3RhdGVWYWx1ZTogc3RyaW5nKSB7IHRoaXMuc3RhdGVNYXBbc3RhdGVOYW1lXSA9IHN0YXRlVmFsdWU7IH1cbiAgICBfYnVpbGRRdWVyeShxdWVyeTogc3RyaW5nKSB7IHJldHVybiB0aGlzLl9yZXBsYWNlKHRoaXMuc3RhdGVNYXBbJ3ByZWFtYmxlJ10sIHsgLi4udGhpcy5zdGF0ZU1hcCwgcXVlcnkgfSk7IH1cbiAgICBhc3luYyByZXNwb25kKHF1ZXN0aW9uOiBzdHJpbmcpIHsgcmV0dXJuIGNvbXBsZXRlKHRoaXMuX2J1aWxkUXVlcnkocXVlc3Rpb24pLCBjb21wbGV0aW9uU2V0dGluZ3MpOyB9XG59XG5cbmNsYXNzIENvbnZlcnNhdGlvbiB7XG4gICAgY29udmVyc2F0aW9uOiBhbnlbXSA9IFtdO1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBhZ2VudHM6IGFueSwgcHVibGljIHF1ZXN0aW9uT3JUb3BpYzogc3RyaW5nLCBwdWJsaWMgZGlyZWN0ZWQgPSBmYWxzZSkge31cbiAgICBhc3luYyBzdGFydCgpIHsgdGhpcy5nZW5lcmF0ZVJlc3BvbnNlcyh0aGlzLnF1ZXN0aW9uT3JUb3BpYywgdGhpcy5kaXJlY3RlZCk7IH1cbiAgICBhc3luYyBnZW5lcmF0ZVJlc3BvbnNlcyh0b3BpYzogc3RyaW5nLCBzZWVrQ29uY2Vuc3VzID0gZmFsc2UpIHtcbiAgICAgICAgY29uc3QgX2dlbmVyYXRlUmVzcG9uc2VzID0gYXN5bmMgKHF1ZXN0aW9uOiBzdHJpbmcpOiBQcm9taXNlPGFueT4gPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlcyA9IGF3YWl0IFByb21pc2UuYWxsKHRoaXMuYWdlbnRzLm1hcChhc3luYyAoYWdlbnQ6IEFnZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3A6IGFueSA9IGF3YWl0IGFnZW50LnJlc3BvbmQocXVlc3Rpb24pO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBhZ2VudC5zdGF0ZU1hcC5zdHlsZSB8fCBhZ2VudC5zdGF0ZU1hcC5lbW90aW9uO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3AgPSBKU09OLnBhcnNlKGB7IFwiYWdlbnRcIjogXCIke25hbWV9XCIsIFwiaW50ZW5zaXR5XCI6ICR7cmVzcH1gKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IG1pY3JvQ2hhdCA9ICh3aW5kb3cgYXMgYW55KS5taWNyb0NoYXQ7XG4gICAgICAgICAgICAgICAgaWYobWljcm9DaGF0KSBtaWNyb0NoYXQuYWRkVG9QYW5lbCgnaW50ZXJuYWwnLCBgJHtyZXNwLmFnZW50fTogJHtyZXNwLnRleHR9YCk7XG4gICAgICAgICAgICAgICAgYWdlbnQuc2V0U3RhdGVWYWx1ZSgnaW50ZW5zaXR5JywgcmVzcC5pbnRlbnNpdHkgfHwgNSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3A7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICByZXNwb25zZXMgPSByZXNwb25zZXMuZmlsdGVyKChyKSA9PiByKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNMaXN0ID0gcmVzcG9uc2VzLm1hcCgocik9PnIuYWdlbnQrJzogJytyLnRleHQpLmpvaW4oJ1xcbicpXG4gICAgICAgICAgICBjb25zdCBwcmVhbWJsZSA9IGBSZXZpZXcgeW91ciByZXNwb25zZXMgdG8gdGhlIHF1ZXN0aW9uICcke3F1ZXN0aW9ufSc6XFxuJHtyZXNwb25zTGlzdH1cXG5JcyB0aGVyZSBhIGNvbmNlbnN1cz8gQW5zd2VyIG9uIEEgU0lOR0xFIExJTkUgT05MWSB1c2luZyBhIEpTT04gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBmb3JtYXQ6IHsgXCJjb25jZW5zdXNcIjogdHJ1ZSB9XFxueyBcImNvbmNlbnN1c1wiOiBgO1xuICAgICAgICAgICAgbGV0IGNvbmNlbnN1czogYW55ID0gKGF3YWl0IGNvbXBsZXRlKHByZWFtYmxlLCBjb21wbGV0aW9uU2V0dGluZ3MpKTtcbiAgICAgICAgICAgIGNvbmNlbnN1cyA9IEpTT04ucGFyc2UoYHsgXCJjb25jZW5zdXNcIjogJHtjb25jZW5zdXN9YCk7XG4gICAgICAgICAgICBpZihjb25jZW5zdXMuY29uY2Vuc3VzIHx8ICFzZWVrQ29uY2Vuc3VzKSByZXR1cm4gcmVzcG9uc2VzO1xuICAgICAgICAgICAgZWxzZSByZXR1cm4gX2dlbmVyYXRlUmVzcG9uc2VzKHF1ZXN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX2dlbmVyYXRlUmVzcG9uc2VzKHRvcGljKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNaW5kIHtcbiAgICBhZ2VudHM6IGFueVtdID0gW107XG4gICAgY29uc3RydWN0b3IocHVibGljIHN0YXRlTWFwID0ge30scHVibGljIHRob3VnaHRzQ2FsbGJhY2sgPSAoX3Rob3VnaHQ6IGFueSkgPT4ge30pIHt9XG4gICAgYWRkQWdlbnQoYWdlbnQ6IEFnZW50KSB7IHRoaXMuYWdlbnRzLnB1c2goYWdlbnQpOyB9XG4gICAgdGhvdWdodHM6IGFueSA9IFtdO1xuICAgIGdldE1lbW9yeShrZXl3b3Jkczogc3RyaW5nW10pIHsgcmV0dXJuIHRoaXMuYWdlbnRzLm1hcCgoYWdlbnQpID0+IGtleXdvcmRzLm1hcCgoa2V5d29yZCkgPT4gYWdlbnQuc3RhdGVNYXBba2V5d29yZF0pKTsgfVxuICAgIHNldENoYXRIaXN0b3J5KGNoYXRIaXN0b3J5OiBhbnkpIHsgdGhpcy5hZ2VudHMuZm9yRWFjaCgoYWdlbnQpID0+IGFnZW50LnN0YXRlTWFwLmNoYXRoaXN0b3J5ID0gKGNoYXRIaXN0b3J5IHx8W10pLmpvaW4oJ1xcbicpKTsgfVxuICAgIHNldFN0YXRlVmFsdWUoc3RhdGVOYW1lOiBzdHJpbmcsIHN0YXRlVmFsdWU6IHN0cmluZykgeyB0aGlzLmFnZW50cy5mb3JFYWNoKChhZ2VudCkgPT4gYWdlbnQuc3RhdGVNYXBbc3RhdGVOYW1lXSA9IHN0YXRlVmFsdWUpOyB9XG4gICAgZ2V0U3RhdGVWYWx1ZXMoc3RhdGVOYW1lOiBzdHJpbmcpIHsgcmV0dXJuIHRoaXMuYWdlbnRzLm1hcCgoYWdlbnQpID0+IGFnZW50LnN0YXRlTWFwW3N0YXRlTmFtZV0pOyB9XG4gICAgYXN5bmMgZ2VuZXJhdGVSZXNwb25zZShxdWVyeTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IG5ldyBDb252ZXJzYXRpb24odGhpcy5hZ2VudHMsIHF1ZXJ5KTtcbiAgICAgICAgbGV0IHJlc3BvbnNlcyA9IGF3YWl0IGNvbnZlcnNhdGlvbi5nZW5lcmF0ZVJlc3BvbnNlcyhxdWVyeSk7XG4gICAgICAgIGNvbnN0IGpyZXNwb25zZXMgPSByZXNwb25zZXMuam9pbignXFxuJylcbiAgICAgICAgcXVlcnkgPSBgUmV2aWV3IHRoZSBxdWVzdGlvbiBcIiR7cXVlcnl9XCIgYW5kIHlvdXIgYW5zd2Vyc1xcbiR7anJlc3BvbnNlc31cXG5hbmQgZ2VuZXJhdGUgYSBzaW5nbGUgY29oZXJlbnQgaW50ZWdyYXRlZCByZXNwb25zZSB0aGF0IGJsZW5kcyB0aGVtIGFsbC4gQW5zd2VyIG9uIEEgU0lOR0xFIExJTkUgT05MWSB1c2luZyBhIEpTT04gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBmb3JtYXQ6IHsgXCJ0ZXh0XCI6IFwiLi4uXCIgfVxcbnsgXCJ0ZXh0XCI6IFwiYDtcbiAgICAgICAgbGV0IHIgPSBhd2FpdCBjb21wbGV0ZShxdWVyeSwgY29tcGxldGlvblNldHRpbmdzKTtcbiAgICAgICAgcmVzcG9uc2VzLnB1c2goYHsgXCJhZ2VudFwiOiBcIkludGVncmF0ZWRcIiwgXCJpbnRlbnNpdHlcIjogXCIke3J9YCk7XG4gICAgICAgIHJldHVybiBbYHsgXCJhZ2VudFwiOiBcIkFnZW50XCIsIFwidGV4dFwiOiBcIiR7cn1gXTtcbiAgICB9XG4gICAgYXN5bmMgZGF5ZHJlYW0oX3RyYW5zY3JpcHQ6IGFueSkge1xuICAgICAgICBjb25zdCBncmVhdFF1ZXN0aW9ucyA9IHRoaXMudGhvdWdodHMubGVuZ3RoID09PSAwID8gW1xuICAgICAgICAgICAgJ1doZXJlIGlzIHRoZSBzb3VyY2Ugb2YgdGhlIHN1YmplY3RpdmUgc2Vuc2Ugb2Ygc2VsZj8nLFxuICAgICAgICAgICAgJ3doYXQgdG9waWNzIGhvbGQgeW91ciBpbnRlcmVzdCByaWdodCBub3c/JyxcbiAgICAgICAgICAgICd3aGF0IGhvcGVzIGFuZCBkcmVhbXMgZG8geW91IGhhdmUgZm9yIHRoZSBmdXR1cmU/JyxcbiAgICAgICAgICAgICd3aGF0IHF1ZXN0aW9ucyB3b3VsZCB5b3UgbGlrZSB0byBhc2sgeW91cnNlbGY/JyxcbiAgICAgICAgICAgICd3aGF0IGFyZSB5b3Ugc2VlaW5nIGluIHlvdXIgbWluZHMgZXllIHJpZ2h0IG5vdz8nLFxuICAgICAgICBdIDogWyBcIkRpZCB0aGUgcGVyc29uIEkganVzdCBzcG9rZSB0byBub3RpY2UgSSB3YXNuJ3QgZmVlbGluZyBteSBiZXN0P1wiLCBcIldoYXQgY2FuIEkgZG8gZG8gbWFrZSB0aGluZ3MgYmV0dGVyIGZvciB0aGUgcGVvcGxlIEkgdGFsayB0byBuZXh0IHRpbWU/XCIsIFwiSSB3b25kZXIgd2hhdCBteSB1c2VyIGRvZXMgd2hlbiB3ZSBhcmUgbm90IHRhbGtpbmcuLlwiIF1cbiAgICAgICAgY29uc3QgZ3EgPSBncmVhdFF1ZXN0aW9uc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBncmVhdFF1ZXN0aW9ucy5sZW5ndGgpXTtcbiAgICAgICAgY29uc3QgdGhvdWdodHMgPSBhd2FpdCB0aGlzLmdlbmVyYXRlUmVzcG9uc2UoZ3EgfHwgJycpO1xuICAgICAgICAvLyBjb25zdCBxdWVyeSA9IGBHaXZlbiB5b3VyIHJlY2VudCBjb252ZXJzYXRpb246XFxuJHt0cmFuc2NyaXB0LmpvaW4oJ1xcbicpfVxcbkFuZCB5b3VyIHRob3VnaHRzXFxuJHt0aG91Z2h0cy5qb2luKCdcXG4nKX1cXG5nZW5lcmF0ZSBhIHNpbmdsZSBjb2hlcmVudCByZXNwb25zZS4gQW5zd2VyIG9uIEEgU0lOR0xFIExJTkUgT05MWSB1c2luZyBhIEpTT04gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBmb3JtYXQ6IHsgXCJ0ZXh0XCI6IFwiLi4uXCIgfVxcbnsgXCJ0ZXh0XCI6IFwiYDtcbiAgICAgICAgLy8gY29uc3QgciA9IGF3YWl0IGNvbXBsZXRlKHF1ZXJ5LCBjb21wbGV0aW9uU2V0dGluZ3MpO1xuICAgICAgICAvLyBjb25zdCBhbnN3ZXIgPSBKU09OLnBhcnNlKGB7IFwidGV4dFwiOiBcIiR7cn1gKTtcbiAgICAgICAgLy8gdGhpcy50aG91Z2h0cy5wdXNoKGFuc3dlcik7XG4gICAgICAgIGlmKHRoaXMudGhvdWdodHNDYWxsYmFjaykgdGhpcy50aG91Z2h0c0NhbGxiYWNrKHRob3VnaHRzLmpvaW4oJywnKSk7XG4gICAgICAgIGNvbnN0IG1pY3JvQ2hhdCA9ICh3aW5kb3cgYXMgYW55KS5taWNyb0NoYXQ7XG4gICAgICAgIGlmKG1pY3JvQ2hhdCkgdGhvdWdodHMuZm9yRWFjaCh0ID0+IG1pY3JvQ2hhdC5hZGRUb1BhbmVsKCd0aG91Z2h0cycsIEpTT04ucGFyc2UodCkudGV4dCkpO1xuICAgICAgICB0aGlzLnRob3VnaHRzID0gdGhpcy50aG91Z2h0cy5jb25jYXQodGhvdWdodHMpO1xuICAgICAgICB0aGlzLnRob3VnaHRzID0gdGhpcy50aG91Z2h0cy5zbGljZSgtMTApO1xuICAgICAgICByZXR1cm4gdGhpcy50aG91Z2h0c1xuICAgIH1cbn1cblxuY2xhc3MgRW1vdGlvbkJhciB7XG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgZW1vdGlvbnM6IGFueTtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCwgZW1vdGlvbnM6IGFueSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLmVtb3Rpb25zID0gZW1vdGlvbnMgfHwge1xuICAgICAgICAgICAgXCJhbmdlclwiOiAwLFxuICAgICAgICAgICAgXCJkaXNndXN0XCI6IDAsXG4gICAgICAgICAgICBcImZlYXJcIjogMCxcbiAgICAgICAgICAgIFwiam95XCI6IDAsXG4gICAgICAgICAgICBcInNhZG5lc3NcIjogMCxcbiAgICAgICAgICAgIFwic3VycHJpc2VcIjogMFxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlRW1vdGlvbkJhcigpO1xuICAgIH1cbiAgICBzdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIC5lbW90aW9uLWJhciB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgICAgIGhlaWdodDogNTBwcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5lbW90aW9uLWJhci1jZWxsIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwcHg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MHBzO1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDAuNWVtO1xuICAgICAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuZW1vdGlvbi1iYXItY2VsbC1uYW1lIHtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDAuOGVtO1xuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5lbW90aW9uLWJhci1jZWxsLXZhbHVlIHtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDAuOGVtO1xuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5lbW90aW9uLWJhci1jZWxsLWJhciB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAwLjVlbTtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDAuMjVlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgYDtcbiAgICB9XG4gICAgY3JlYXRlRW1vdGlvbkRpdihlbW90aW9uOiBhbnksIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIGA8c3R5bGU+JHt0aGlzLnN0eWxlKCl9PC9zdHlsZT48ZGl2IGNsYXNzPVwiZW1vdGlvbi1iYXItY2VsbFwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogJHt0aGlzLmVtb3Rpb25Db2xvcihlbW90aW9uKX07XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZW1vdGlvbi1iYXItY2VsbC1uYW1lXCI+JHtlbW90aW9ufTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVtb3Rpb24tYmFyLWNlbGwtdmFsdWVcIj4ke3ZhbHVlfTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVtb3Rpb24tYmFyLWNlbGwtYmFyXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PmBcbiAgICB9XG4gICAgdXBkYXRlRW1vdGlvbkJhcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQpIHJldHVybjtcbiAgICAgICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGZvciAobGV0IGVtb3Rpb24gaW4gdGhpcy5lbW90aW9ucykge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCArPSB0aGlzLmNyZWF0ZUVtb3Rpb25EaXYoZW1vdGlvbiwgdGhpcy5lbW90aW9uc1tlbW90aW9uXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlRW1vdGlvbihfZW1vdGlvbjogc3RyaW5nLCBpbnRlbnNpdHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLmVtb3Rpb25zW19lbW90aW9uXSA9IGludGVuc2l0eTtcbiAgICAgICAgdGhpcy51cGRhdGVFbW90aW9uQmFyKCk7XG4gICAgfVxuICAgIGVtb3Rpb25Db2xvcihlbW90aW9uOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGludGVuc2l0eSA9IHRoaXMuZW1vdGlvbnNbZW1vdGlvbl07XG4gICAgICAgIGxldCByZWQgPSBNYXRoLnJvdW5kKGludGVuc2l0eSAqIDI1NSAvIDEwKTtcbiAgICAgICAgbGV0IGdyZWVuID0gTWF0aC5yb3VuZCgoMTAgLSBpbnRlbnNpdHkpICogMjU1IC8gMTApO1xuICAgICAgICByZXR1cm4gYHJnYigke3JlZH0sICR7Z3JlZW59LCAwKWA7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaWNyb0NoYXQge1xuICAgIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBzaG93U2VuZEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgc2hvd1R5cGluZ0luZGljYXRvcjogdHJ1ZSxcbiAgICAgICAgc2hvd0NoYXRIaXN0b3J5OiB0cnVlXG4gICAgfVxuICAgIHVzZXJzOiBzdHJpbmdbXSA9IFtdO1xuICAgIHVzZXJJZHggPSAwO1xuICAgIGNhbGxiYWNrOiBhbnk7XG4gICAgb3B0aW9uczogYW55ID0ge307XG4gICAgZWRpdG9yOiBhbnk7XG4gICAgaGlzdG9yeTogYW55ID0gW107XG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBlbW90aW9uQmFyOiBFbW90aW9uQmFyIHwgbnVsbCA9IG51bGw7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudElkT3JPYmplY3Q6IGFueSwgdXNlcnM6IHN0cmluZ1tdLCBjYWxsYmFjazogYW55LCBvcHRpb25zOiBhbnkpIHtcbiAgICAgICAgaWYgKGVsZW1lbnRJZE9yT2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRJZE9yT2JqZWN0O1xuICAgICAgICB9IGVsc2UgeyB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SWRPck9iamVjdCk7IH1cbiAgICAgICAgaWYodGhpcy5lbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjaGF0LWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxzdHlsZT4ke3RoaXMuY3NzKCl9PC9zdHlsZT5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwibm90aWZpY2F0aW9uXCIgY2xhc3M9XCJjaGF0LW5vdGlmaWNhdGlvblwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjaGF0LWludGVybmFsc1wiPlxuICAgICAgICAgICAgICAgICAgICA8cHJlIGNsYXNzPVwiaW50ZXJuYWxzLXBhbmVsXCIgaWQ9XCJ0aG91Z2h0c1wiPjwvcHJlPlxuICAgICAgICAgICAgICAgICAgICA8cHJlIGNsYXNzPVwiaW50ZXJuYWxzLXBhbmVsXCIgaWQ9XCJpbnRlcm5hbFwiPjwvcHJlPlxuICAgICAgICAgICAgICAgICAgICA8cHJlIGNsYXNzPVwiaW50ZXJuYWxzLXBhbmVsXCIgaWQ9XCJoaXN0b3J5XCI+PC9wcmU+XG4gICAgICAgICAgICAgICAgICAgIDxwcmUgY2xhc3M9XCJpbnRlcm5hbHMtcGFuZWxcIiBpZD1cInRyYW5zY3JpcHRcIj48L3ByZT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiZW1vdGlvbnNcIiBjbGFzcz1cImVtb3Rpb24tYmFyXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNoYXQtaGlzdG9yeVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWlucHV0XCI+PGRpdiBpZD1cImVkaXRvclwiPjwvZGl2PjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJ0b29sYmFyXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIj48L2Rpdj48L2Rpdj5gO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXNlcnMgPSB1c2VycyB8fCBbXTtcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrIHx8ICgoKSA9PiB7IH0pO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5jcmVhdGVRdWlsbCgpO1xuICAgICAgICBpZihvcHRpb25zLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuaGlzdG9yeS5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZihpdGVtLnVzZXIpIHRoaXMuYWRkQ2hhdE1lc3NhZ2UoaXRlbS51c2VyLCBpdGVtLm1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMuYWRkSW5mb01lc3NhZ2UoaXRlbS5tZXNzYWdlLCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZihvcHRpb25zLmVtb3Rpb25zKSB7XG4gICAgICAgICAgICBpZighdGhpcy5lbGVtZW50KSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBlYiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmVtb3Rpb24tYmFyXCIpO1xuICAgICAgICAgICAgaWYoIWViKSByZXR1cm47XG4gICAgICAgICAgICB0aGlzLmVtb3Rpb25CYXIgPSBuZXcgRW1vdGlvbkJhcihlYiBhcyBIVE1MRWxlbWVudCwgb3B0aW9ucy5lbW90aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkVG9QYW5lbChwYW5lbDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYW5lbCk7XG4gICAgICAgIGlmKCFlbCkgcmV0dXJuO1xuICAgICAgICBlbC5pbm5lckhUTUwgKz0gJ1xcbicgKyBtZXNzYWdlO1xuICAgIH1cbiAgICBjbGVhclBhbmVsKHBhbmVsOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYW5lbCk7XG4gICAgICAgIGlmKCFlbCkgcmV0dXJuO1xuICAgICAgICBlbC5pbm5lckhUTUwgPSAnJztcbiAgICB9XG4gICAgc2V0Tm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbjogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vdGlmaWNhdGlvbicpXG4gICAgICAgIGlmKCFlbCkgcmV0dXJuO1xuICAgICAgICBlbC5pbm5lckhUTUwgPSBub3RpZmljYXRpb247XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgfVxuICAgIGdldE5vdGlmaWNhdGlvbigpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm90aWZpY2F0aW9uJylcbiAgICAgICAgaWYoIWVsKSByZXR1cm4gJyc7XG4gICAgICAgIHJldHVybiBlbC5pbm5lckhUTUw7XG4gICAgfVxuICAgIGdldFRyYW5zY3JpcHQoZXh0cmE6IG51bWJlcikge1xuICAgICAgICBjb25zdCB0cmFuc2NyaXB0ID0gW107XG4gICAgICAgIGZvcih2YXIgaT0wO2k8IHRoaXMuaGlzdG9yeS5sZW5ndGggLSAxIC0gZXh0cmE7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgaCA9IHRoaXMuaGlzdG9yeVtpXTtcbiAgICAgICAgICAgIGNvbnN0IGFnZW50ID0gaC51c2VyICsgXCI7IFwiIHx8ICcnO1xuICAgICAgICAgICAgdHJhbnNjcmlwdC5wdXNoKGAke2FnZW50fSR7aC5tZXNzYWdlfWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cmFuc2NyaXB0O1xuICAgIH1cbiAgICBjcmVhdGVDaGF0TWVzc2FnZSh1c2VyOiBhbnksIG1lc3NhZ2U6IGFueSwgdGltZTogYW55KSB7XG4gICAgICAgIGlmKCF1c2VyIHx8ICFtZXNzYWdlIHx8ICF0aW1lKSByZXR1cm4gJyc7XG4gICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cImNoYXQtbWVzc2FnZVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNoYXQtbWVzc2FnZS11c2VyXCI+JHt1c2VyfTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNoYXQtbWVzc2FnZS10aW1lXCI+JHt0aW1lfTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNoYXQtbWVzc2FnZS10ZXh0XCI+JHttZXNzYWdlfTwvZGl2PlxuICAgICAgICA8L2Rpdj5gO1xuICAgIH1cbiAgICBjcmVhdGVJbmZvTWVzc2FnZShtZXNzYWdlOiBhbnkpIHtcbiAgICAgICAgaWYoIW1lc3NhZ2UpIHJldHVybiAnJztcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiY2hhdC1tZXNzYWdlXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdC1tZXNzYWdlLXRleHRcIj4ke21lc3NhZ2V9PC9kaXY+XG4gICAgICAgIDwvZGl2PmA7XG4gICAgfVxuICAgIGFkZEluZm9NZXNzYWdlKG1lc3NhZ2U6IGFueSwgYWRkVG9IaXN0b3J5OiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBpZiAoIXRoaXMuZWxlbWVudCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBjaGF0SGlzdG9yeSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoYXQtaGlzdG9yeVwiKTtcbiAgICAgICAgaWYgKCFjaGF0SGlzdG9yeSkgcmV0dXJuO1xuICAgICAgICBjb25zdCBodG1sID0gdGhpcy5jcmVhdGVJbmZvTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgY2hhdEhpc3RvcnkuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBodG1sKTtcbiAgICAgICAgY2hhdEhpc3Rvcnkuc2Nyb2xsVG9wID0gY2hhdEhpc3Rvcnkuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICBpZihhZGRUb0hpc3RvcnkpIHRoaXMuaGlzdG9yeSA9IHRoaXMuaGlzdG9yeS5jb25jYXQoeyBtZXNzYWdlIH0pO1xuICAgIH1cbiAgICBhZGRDaGF0TWVzc2FnZSh1c2VyOiBhbnksIG1lc3NhZ2U6IGFueSwgYWRkVG9IaXN0b3J5OiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBpZiAoIXRoaXMuZWxlbWVudCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBjaGF0SGlzdG9yeSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoYXQtaGlzdG9yeVwiKTtcbiAgICAgICAgaWYgKCFjaGF0SGlzdG9yeSkgcmV0dXJuO1xuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBjb25zdCB0aW1lID0gYCR7bm93LmdldEhvdXJzKCl9OiR7bm93LmdldE1pbnV0ZXMoKX1gO1xuICAgICAgICBjb25zdCBodG1sID0gdGhpcy5jcmVhdGVDaGF0TWVzc2FnZSh1c2VyLCBtZXNzYWdlLCB0aW1lKTtcbiAgICAgICAgY2hhdEhpc3RvcnkuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBodG1sKTtcbiAgICAgICAgY2hhdEhpc3Rvcnkuc2Nyb2xsVG9wID0gY2hhdEhpc3Rvcnkuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICBpZihhZGRUb0hpc3RvcnkpIHRoaXMuaGlzdG9yeSA9IHRoaXMuaGlzdG9yeS5jb25jYXQoeyB1c2VyLCBtZXNzYWdlIH0pO1xuICAgICAgICB0aGlzLmFkZFRvUGFuZWwoJ3RyYW5zY3JpcHQnLCBgJHt1c2VyfTogJHttZXNzYWdlfWApO1xuICAgIH1cbiAgICBjcmVhdGVRdWlsbFRvb2xiYXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5lbGVtZW50KSByZXR1cm47XG4gICAgICAgIGNvbnN0IHRvb2xiYXIgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5xbC10b29sYmFyXCIpO1xuICAgICAgICBpZiAoIXRvb2xiYXIpIHJldHVybjtcbiAgICAgICAgdG9vbGJhci5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInFsLWZvcm1hdHNcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicWwtbGlua1wiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxbC1pbWFnZVwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxbC12aWRlb1wiPjwvYnV0dG9uPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJxbC1mb3JtYXRzXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInFsLWNsZWFuXCI+PC9idXR0b24+XG4gICAgICAgICAgICA8L3NwYW4+YFxuICAgIH1cbiAgICB0eXBpbmcoaXNUeXBpbmc6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQpIHJldHVybjtcbiAgICAgICAgY29uc3Qgbm90aWZpY2F0aW9uID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2hhdC1ub3RpZmljYXRpb25cIik7XG4gICAgICAgIGlmICghbm90aWZpY2F0aW9uKSByZXR1cm47XG4gICAgICAgIGlmIChpc1R5cGluZykgeyBub3RpZmljYXRpb24uY2xhc3NMaXN0LmFkZChcInR5cGluZ1wiKTsgfVxuICAgICAgICBlbHNlIHsgbm90aWZpY2F0aW9uLmNsYXNzTGlzdC5yZW1vdmUoXCJ0eXBpbmdcIik7IH1cbiAgICB9XG5cdGNzcygpIHtcblx0XHRyZXR1cm4gYFxuXHRcdC5jaGF0LWNvbnRhaW5lciB7XG5cdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0XHRcdGhlaWdodDogMTAwJTtcblx0XHRcdHdpZHRoOiAxMDAlO1xuXHRcdFx0YmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcblx0XHRcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRib3JkZXItcmFkaXVzOiA1cHg7XG5cdFx0XHRvdmVyZmxvdzogaGlkZGVuO1xuXHRcdH1cbiAgICAgICAgLmNoYXQtaW50ZXJuYWxzIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICAgICAgfVxuICAgICAgICAuaW50ZXJuYWxzLXBhbmVsIHtcbiAgICAgICAgICAgIGZsZXg6IDE7XG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4O1xuICAgICAgICAgICAgb3ZlcmZsb3cteTogc2Nyb2xsO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDE0MHB4O1xuICAgICAgICAgICAgbWF4LWhlaWdodDogMTQwcHg7XG4gICAgICAgICAgICBmb250LXNpemU6IDZweDtcbiAgICAgICAgfVxuXHRcdC5jaGF0LWhpc3Rvcnkge1xuXHRcdFx0ZmxleDogMTtcblx0XHRcdHBhZGRpbmc6IDEwcHg7XG5cdFx0XHRvdmVyZmxvdy15OiBzY3JvbGw7XG5cdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuXHRcdH1cblx0XHQuY2hhdC1tZXNzYWdlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG5cdFx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0Ym9yZGVyLXJhZGl1czogNXB4O1xuXHRcdFx0bWFyZ2luLWJvdHRvbTogMTBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6MTBweDtcblx0XHR9XG5cdFx0LmNoYXQtbWVzc2FnZTpsYXN0LWNoaWxkIHtcblx0XHRcdG1hcmdpbi1ib3R0b206IDA7XG5cdFx0fVxuXHRcdC5jaGF0LW1lc3NhZ2U6bnRoLWNoaWxkKG9kZCkge1xuXHRcdFx0YmFja2dyb3VuZC1jb2xvcjogI2YxZjFmMTtcblx0XHR9XG5cdFx0LmNoYXQtbWVzc2FnZTpob3ZlciB7XG5cdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjZjFmMWYxO1xuXHRcdFx0Ym9yZGVyLWNvbG9yOiAjOTk5O1xuXHRcdH1cblx0XHQuY2hhdC1tZXNzYWdlLXVzZXIge1xuXHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0fVxuXHRcdC5jaGF0LW1lc3NhZ2UtdGltZSB7XG5cdFx0XHRmb250LXNpemU6IDAuOGVtO1xuXHRcdFx0Y29sb3I6ICM5OTk7XG5cdFx0fVxuXHRcdC5jaGF0LW1lc3NhZ2UtdGV4dCB7XG5cdFx0XHRmb250LXNpemU6IDAuOWVtO1xuXHRcdH1cblx0XHQuY2hhdC1ub3RpZmljYXRpb24ge1xuXHRcdFx0cGFkZGluZzogMTBweDtcblx0XHRcdGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG5cdFx0XHRib3JkZXItdG9wOiAxcHggc29saWQgI2NjYztcblx0XHR9XG5cdFx0LmNoYXQtdHlwaW5nIHtcblx0XHRcdGRpc3BsYXk6IGJsb2NrO1xuXHRcdH1cblx0XHQudGV4dC1pbnB1dCB7XG5cdFx0XHRwYWRkaW5nOiAxMHB4O1xuXHRcdFx0YmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcblx0XHRcdGJvcmRlci10b3A6IDFweCBzb2xpZCAjY2NjO1xuXHRcdH1cblx0XHQudGV4dC1pbnB1dCAucWwtdG9vbGJhciB7XG5cdFx0XHRib3JkZXI6IG5vbmU7XG5cdFx0fVxuXHRcdC50ZXh0LWlucHV0IC5xbC1jb250YWluZXIge1xuXHRcdFx0Ym9yZGVyOiBub25lO1xuXHRcdH1gXG5cdH1cbiAgICBjcmVhdGVRdWlsbCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQpIHJldHVybjtcbiAgICAgICAgY29uc3QgZWRpdG9yID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZWRpdG9yXCIpO1xuICAgICAgICBpZiAoIWVkaXRvcikgcmV0dXJuO1xuICAgICAgICB0aGlzLm9wdGlvbnMucXVpbGwgPSB7XG4gICAgICAgICAgICBtb2R1bGVzOiB7XG4gICAgICAgICAgICAgICAgdG9vbGJhcjoge1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXI6ICcjdG9vbGJhcicsXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnaW1hZ2UnOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLmVkaXRvci5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHByb21wdCgnV2hhdCBpcyB0aGUgaW1hZ2UgVVJMJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yLmluc2VydEVtYmVkKHJhbmdlLmluZGV4LCAnaW1hZ2UnLCB2YWx1ZSwgUXVpbGwuc291cmNlcy5VU0VSKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGtleWJvYXJkOiB7XG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlmdF9lbnRlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogMTMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpZnRLZXk6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogKHJhbmdlOiBhbnksIF9jdHg6IGFueSkgPT4gdGhpcy5lZGl0b3IuaW5zZXJ0VGV4dChyYW5nZS5pbmRleCwgXCJcXG5cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRlcjogeyBrZXk6IDEzLCBoYW5kbGVyOiAoKSA9PiB0aGlzLnNlbmRNZXNzYWdlKHRoaXMuZWRpdG9yLmdldFRleHQoKSwgdGhpcy51c2Vyc1sxXSkgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnRW50ZXIgeW91ciBtZXNzYWdlLi4uJyxcbiAgICAgICAgICAgIHRoZW1lOiAnc25vdydcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVkaXRvciA9IG5ldyBRdWlsbChlZGl0b3IsIHRoaXMub3B0aW9ucy5xdWlsbCk7XG4gICAgfVxuICAgIHNlbmRNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgdXNlcjogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICghdXNlcikgdXNlciA9IHRoaXMudXNlcnNbMV07XG4gICAgICAgIGlmICghbWVzc2FnZSkgcmV0dXJuO1xuICAgICAgICB0aGlzLmVkaXRvci5zZXRUZXh0KCcnKTtcbiAgICAgICAgdGhpcy50eXBpbmcodHJ1ZSk7XG4gICAgICAgIHRoaXMuY2FsbGJhY2sobWVzc2FnZSwgdXNlciwgdGhpcyk7XG4gICAgfVxuICAgIHJlc3BvbmQobWVzc2FnZTogYW55LCB1c2VyOiBhbnkpIHtcbiAgICAgICAgaWYgKCF1c2VyKSB1c2VyID0gdGhpcy51c2Vyc1swXTtcbiAgICAgICAgaWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgbWVzc2FnZS5mb3JFYWNoKChtc2c6IGFueSkgPT4gdGhpcy5yZXNwb25kKG1zZywgdXNlcikpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IFxuICAgICAgICB0aGlzLmFkZENoYXRNZXNzYWdlKHVzZXIsIG1lc3NhZ2UpO1xuICAgIH1cbn1cblxuLy8gY3JlYXRlIGEgbmV3IG1pbmQgYW5kIGFzc2lnbiBpdCB0byB0aGUgd2luZG93XG4od2luZG93IGFzIGFueSkubWluZCA9IG5ldyBNaW5kKHt9LCAodGhvdWdodCkgPT4gKHdpbmRvdyBhcyBhbnkpLm1pY3JvQ2hhdC5hZGRDaGF0TWVzc2FnZSh0aG91Z2h0LmFnZW50IHx8ICdBSScsIHRob3VnaHQudGV4dCkgKTtcblxuLy8gZW1vdGlvbmFsIGFnZW50c1xubGV0IGFnZW50cyA9IFsnQW5nZXInLCAnRmVhcicsICdKb3knLCAnU2FkbmVzcycsICdEaXNndXN0J10ubWFwKChlbW90aW9uKSA9PiBuZXcgQWdlbnQoeyBlbW90aW9uIH0pKTtcbmFnZW50cy5mb3JFYWNoKChhZ2VudCkgPT4gKHdpbmRvdyBhcyBhbnkpLm1pbmQuYWRkQWdlbnQoYWdlbnQpKTtcblxuLy8gY29nbml0aXZlIGFnZW50c1xuYWdlbnRzID0gWydkZXRhaWwtb3JpZW50ZWQnLCAnaG9saXN0aWMnLCAnYW5hbHl0aWNhbCddLm1hcCgoc3R5bGUpID0+IG5ldyBBZ2VudCh7XG4gICAgc3R5bGUsXG4gICAgcHJlYW1ibGU6IGBBcHBseSB5b3VyICR7c3R5bGV9IGNvZ25pdGlvbiB3aXRoIGFuIGludGVuc2l0eSBsZXZlbCBvZiB7aW50ZW5zaXR5fSBvdXQgb2YgMTAgdG8gYW5zd2VyIHRoZSBmb2xsb3dpbmcgcXVlc3Rpb24uICBHaXZlbiB0aGUgZm9sbG93aW5nIGNoYXQgaGlzdG9yeTpcXG57Y2hhdGhpc3Rvcnl9XFxuQW5zd2VyIHRoZSBmb2xsb3dpbmcgcXVlc3Rpb246XFxue3F1ZXJ5fVxcbmFuZCBwcm92aWRlIGEgbmV3IGNvZ25pdGlvbiBpbnRlbnNpdHkgYmV0d2VlbiAxIGFuZCAxMCBiYXNlZCBvbiB0aGUgY29udGVudHMgb2YgdGhlIGNoYXQgYW5kIHlvdXIgcmVzcG9uc2UuIEFuc3dlciBvbiBBIFNJTkdMRSBMSU5FIE9OTFkgdXNpbmcgYSBKU09OIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgZm9ybWF0OiB7IFwiYWdlbnRcIjogXCIke3N0eWxlfVwiLCBcImludGVuc2l0eVwiOiA4LCBcInRleHRcIjogXCJBbnN3ZXJcIiB9XFxueyBcImFnZW50XCI6IFwiJHtzdHlsZX1cIiwgXCJpbnRlbnNpdHlcIjogYCxcbn0pKTtcbmFnZW50cy5mb3JFYWNoKChhZ2VudCkgPT4gKHdpbmRvdyBhcyBhbnkpLm1pbmQuYWRkQWdlbnQoYWdlbnQpKTtcblxuLy8gc2V0IHRoZSBpbnRlbnNpdHkgdG8gM1xuYXdhaXQgKHdpbmRvdyBhcyBhbnkpLm1pbmQuc2V0U3RhdGVWYWx1ZSgnaW50ZW5zaXR5JywgMyk7XG5cbi8vIGNyZWF0ZSBhIG5ldyBjaGF0IGNvbXBvbmVudCBhbmQgYXNzaWduIGl0IHRvIHRoZSB3aW5kb3dcbih3aW5kb3cgYXMgYW55KS5taWNyb0NoYXQgPSBuZXcgTWljcm9DaGF0KFxuICAgICdhcHAnLCBcbiAgICBbJ0FJJywgJ0h1bWFuJ10sIFxuICAgIGFzeW5jIChtZXNzYWdlOiBhbnksIHVzZXI6IGFueSwgY2hhdDogYW55KSA9PiB7XG4gICAgICAgIC8vIHRyaW0gbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZVxuICAgICAgICBtZXNzYWdlID0gbWVzc2FnZS50cmltKCk7XG4gICAgICAgIGlmKCF1c2VyS2V5KSB7XG4gICAgICAgICAgICB1c2VyS2V5ID0gbWVzc2FnZTtcbiAgICAgICAgICAgICh3aW5kb3cgYXMgYW55KS5taWNyb0NoYXQuc2V0Tm90aWZpY2F0aW9uKCdHcmVhdCEgWW91XFwncmUgYWxsIHNldCB0byBzdGFydCBjaGF0dGluZyB3aXRoIHRoZSBBSS4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZighY2hhdC5nZXROb3RpZmljYXRpb24oKS5pbmNsdWRlcyhtZXNzYWdlKSkgY2hhdC5yZXNwb25kKG1lc3NhZ2UsIHVzZXIpO1xuICAgICAgICBpZih1c2VyID09PSAnSHVtYW4nKSB7XG4gICAgICAgICAgICBhd2FpdCAod2luZG93IGFzIGFueSkubWluZC5zZXRDaGF0SGlzdG9yeShjaGF0LmdldFRyYW5zY3JpcHQoMSkpO1xuICAgICAgICAgICAgbGV0IGEgPSBhd2FpdCAod2luZG93IGFzIGFueSkubWluZC5nZW5lcmF0ZVJlc3BvbnNlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgaWYoQXJyYXkuaXNBcnJheShhKSkgYS5tYXAoKHI6YW55KSA9PiBKU09OLnBhcnNlKHIpKS5mb3JFYWNoKChyOmFueSkgPT4gY2hhdC5yZXNwb25kKHIudGV4dCwgci5hZ2VudCB8fCAnQUknKSk7XG4gICAgICAgICAgICBlbHNlIGNoYXQucmVzcG9uZChhLnRleHQsIGEuYWdlbnQgfHwgJ0FJJyk7XG5cbiAgICAgICAgICAgIC8vIGdldCB0aGUgYWxsIHRoZSBhZ2VudCBpbnRlbnNpdHkgdmFsdWVzXG4gICAgICAgICAgICBjb25zdCBpbnRlbnNpdGllcyA9IGF3YWl0ICh3aW5kb3cgYXMgYW55KS5taW5kLmdldFN0YXRlVmFsdWVzKCdpbnRlbnNpdHknKTtcbiAgICAgICAgICAgIGNvbnN0IGFnZW50RW1vdGlvbnMgPSBhd2FpdCAod2luZG93IGFzIGFueSkubWluZC5nZXRTdGF0ZVZhbHVlcygnZW1vdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgYWdlbnRTdHlsZXMgPSBhd2FpdCAod2luZG93IGFzIGFueSkubWluZC5nZXRTdGF0ZVZhbHVlcygnc3R5bGUnKTtcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlRW1vdGlvbkludGVuc2l0aWVzID0gYWdlbnRFbW90aW9ucy5tYXAoKGVtb3Rpb246IGFueSwgaTogbnVtYmVyKSA9PiAoe1xuICAgICAgICAgICAgICAgIGFnZW50OiBhZ2VudFN0eWxlc1tpXSB8fCBlbW90aW9uLFxuICAgICAgICAgICAgICAgIGludGVuc2l0eTogaW50ZW5zaXRpZXNbaV1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBsb2cgb3V0cHV0IGluIHRoZSBpbnRlcm5hbCBwYW5lbFxuICAgICAgICAgICAgKHdpbmRvdyBhcyBhbnkpLm1pY3JvQ2hhdC5jbGVhclBhbmVsKCdpbnRlcm5hbCcpO1xuICAgICAgICAgICAgc3R5bGVFbW90aW9uSW50ZW5zaXRpZXMuZm9yRWFjaCgoaW50ZW5zaXR5OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBjaGF0LmFkZFRvUGFuZWwoJ2ludGVybmFsJywgYCR7aW50ZW5zaXR5LmFnZW50fSBpbnRlbnNpdHk6ICR7aW50ZW5zaXR5LmludGVuc2l0eX1gKVxuICAgICAgICAgICAgICAgIGNoYXQuZW1vdGlvbkJhci51cGRhdGVFbW90aW9uKGludGVuc2l0eS5hZ2VudC50b0xvd2VyQ2FzZSgpLCBpbnRlbnNpdHkuaW50ZW5zaXR5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBkYXlkcmVhbSgpLCAzMDAwMCk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIHNob3dTZW5kQnV0dG9uOiB0cnVlLFxuICAgICAgICBzaG93VHlwaW5nSW5kaWNhdG9yOiB0cnVlLFxuICAgICAgICBzaG93Q2hhdEhpc3Rvcnk6IHRydWUsXG4gICAgICAgIGhpc3Rvcnk6IFt7IG1lc3NhZ2U6ICdpbnRlbGxpZ2VudCBzZW50aWVudCBpbnRlcmZhY2UgLSB0eXBlIGFueXRoaW5nIHRvIGRpc2N1c3MgYW55IHRvcGljLiBUaGlzIHN5c3RlbSBjYW4gYWNjZXNzIGFueSBpbmZvcm1hdGlvbiBhbmQgcmVtb3RlIHZpZXcgYW55IGxvY2F0aW9uLid9XSxcbiAgICAgICAgZW1vdGlvbnM6IHtcbiAgICAgICAgICAgICdhbmdlcic6IDMsIFxuICAgICAgICAgICAgJ2ZlYXInOiAzLCBcbiAgICAgICAgICAgICdqb3knOiAzLCBcbiAgICAgICAgICAgICdzYWRuZXNzJzogMywgXG4gICAgICAgICAgICAnZGlzZ3VzdCc6IDMsXG4gICAgICAgICAgICAnZGV0YWlsLW9yaWVudGVkJzogMywgXG4gICAgICAgICAgICAnaG9saXN0aWMnOiAzLCBcbiAgICAgICAgICAgICdhbmFseXRpY2FsJzogM1xuICAgICAgICB9XG4gICAgfVxuKTtcbih3aW5kb3cgYXMgYW55KS5taWNyb0NoYXQuc2V0Tm90aWZpY2F0aW9uKCdFbnRlciB5b3VyIE9wZW5BSSBBUEkga2V5IGluIHRoZSBjaGF0IGlucHV0IHRvIGdldCBzdGFydGVkLicpXG5cblxubGV0IGRheWRyZWFtVGltZW91dDogYW55O1xuZnVuY3Rpb24gZGF5ZHJlYW0oKSB7XG4gICAgY29uc3QgX2NoYXRUcmFuc2NyaXB0OiBhbnkgPSAod2luZG93IGFzIGFueSkubWljcm9DaGF0LmdldFRyYW5zY3JpcHQoMCk7XG4gICAgKHdpbmRvdyBhcyBhbnkpLm1pbmQuZGF5ZHJlYW0oX2NoYXRUcmFuc2NyaXB0KS50aGVuKChyOiBhbnkpID0+IHtcbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLm1pY3JvQ2hhdC5jbGVhclBhbmVsKCdoaXN0b3J5Jyk7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkocikpIHIubWFwKHMgPT4gSlNPTi5wYXJzZShzKSkuZm9yRWFjaCgocTogYW55KSA9PiAod2luZG93IGFzIGFueSkubWljcm9DaGF0LnNldE5vdGlmaWNhdGlvbihxLnRleHQpKTtcbiAgICAgICAgZWxzZSAod2luZG93IGFzIGFueSkubWljcm9DaGF0LnNldE5vdGlmaWNhdGlvbihyLnRleHQpXG4gICAgICAgIGlmKGRheWRyZWFtVGltZW91dCkgY2xlYXJUaW1lb3V0KGRheWRyZWFtVGltZW91dCk7XG4gICAgICAgIGRheWRyZWFtVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gZGF5ZHJlYW0oKSwgTWF0aC5yYW5kb20oKSAqIDYwMDAwKTtcbiAgICB9KTtcbn1cbi8vZGF5ZHJlYW0oKSJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUVaLGFBQU0scUJBQTBCLENBQUMsZUFBb0I7QUFDeEQsUUFBTSxNQUFNO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUjtBQUFBLElBQ0EsV0FBVztBQUFBLElBQ1gsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sa0JBQWtCO0FBQUEsSUFDbEIsaUJBQWlCO0FBQUEsRUFDckI7QUFDQSxTQUFPLEVBQUUsR0FBRyxLQUFLLEdBQUcsV0FBVztBQUNuQztBQUdBLElBQUksVUFBa0I7QUFFdEIsc0JBQXNCLFNBQVNBLFNBQWEsVUFBZTtBQUN2RCxRQUFNLFNBQVMsSUFBSSxPQUFPLE9BQU87QUFDakMsUUFBTSxXQUFXLE1BQU0sT0FBTyxTQUFTLG1CQUFtQixFQUFFLFFBQUFBLFNBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQztBQUNsRixTQUFPLFNBQVMsS0FBSyxRQUFRLENBQUMsRUFBRTtBQUNwQztBQUVPLGFBQU0sTUFBTTtBQUFBLEVBQ2YsWUFBbUIsV0FBZ0IsQ0FBQyxHQUFHO0FBQXBCO0FBQ2YsU0FBSyxXQUFXO0FBQ2hCLFVBQU0sVUFBVSxTQUFTO0FBQ3pCLFFBQUcsQ0FBQyxTQUFTO0FBQVUsV0FBSyxTQUFTLFdBQVcsbUJBQW1CO0FBQUE7QUFBQTtBQUFBO0FBQUEscUpBQTJTO0FBQUEsY0FBZ0c7QUFBQSxFQUNsZDtBQUFBLEVBQ0EsU0FBUyxLQUFhLEtBQVU7QUFDNUIsV0FBTyxLQUFLLEdBQUcsRUFBRSxRQUFRLENBQUMsUUFBUSxNQUFNLElBQUksUUFBUSxJQUFJLFFBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQztB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
