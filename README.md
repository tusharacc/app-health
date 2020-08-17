# app-health
Raspberry PI based App health

Showcasing the use of Raspberry PI in application monitoring.

The demo of the tool is present in below youtube link - 

https://www.youtube.com/watch?v=J9VK4vB7MJE

Hardware - Raspberry Pi 3B, LCD Monitor and HDMI Cable

Technologies used - 

NodeJS (ElectronJS) for Front end
MQTT for messaging

To circumvent the Firewall (i wanted to accomplish with available resources) I used Twilio. Python was used to make a Twilio call. Twilio had webhook that called
Express server hosted on Heroku. Express server posted the message to MQTT and it was pushed to Raspberry PI.

Rapsberry PI was hooked to miniature Traffic light and speaker system. In case of error, the traffic light turned red and made announcement of the error.
