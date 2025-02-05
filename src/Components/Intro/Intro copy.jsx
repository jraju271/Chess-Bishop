import React, { useEffect } from 'react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import {SPEAK} from '../../Middleware/Utils/Speak'
import './Intro.css'

function Intro() {
  const hasSeenTour = localStorage.getItem('hasSeenTour');
    const driverObj = driver({
      popoverClass: 'driverjs-theme',
      highlightClass: 'custom-highlight',
      showProgress: true,
      steps: [
        {
          popover: {
            title: 'Welcome to SIGARAM64',
            description:`<h5>Get ready for the Website Tour - Your Chess Mastery Journey Begins Here!</h5>`,
            // By passing onNextClick, you can override the default behavior of the next button.
            // This will prevent the driver from moving to the next step automatically.
            // You can then manually call driverObj.moveNext() to move to the next step.
            // onPopoverRender:()=> {SPEAK("Get ready for the Website Tour - Your Chess Mastery Journey Begins Here!")},
          },

        },
        {
          element: '#ChatBotBox',
          popover: {
            title: 'The Bot',
            description: `<h5>Hey there, Charm! I'm your guide to this chess wonderland! Let's embark on an interactive tour where I'll unveil all the amazing features this website has in store for you. Ready for an exciting journey through the world of chess mastery? Let's get started!</h5>`
          },
          // onDeselected is called when the element is deselected.
          // Here we are simply removing the element from the DOM.
          // onPopoverRender:()=> {SPEAK("Hey there, Charm! I'm your guide to this chess wonderland! Let's embark on an interactive tour where I'll unveil all the amazing features this website has in store for you. Ready for an exciting journey through the world of chess mastery? Let's get started!")},

        },
        {
          element: '#HomeNav',
          popover: {
            title: 'Home',
            description: `<h5> Hit Home and let's make chess learning a blast!</h5>`
          },
          // onDeselected is called when the element is deselected.
          // Here we are simply removing the element from the DOM.
          // onPopoverRender:()=> {SPEAK("Hit Home and let's make chess learning a blast!")},


        },
        {
          element: '#Play',
          popover: {
            title: 'Play',
            description: `<h5> Discover endless fun at your fingertips! Challenge friends, face random players, or conquer AI opponents with our dynamic play button</h5>`
          },
          // onDeselected is called when the element is deselected.
          // Here we are simply removing the element from the DOM.
          // onPopoverRender:()=> {SPEAK("Discover endless fun at your fingertips! Challenge friends, face random players, or conquer AI opponents with our dynamic play button")},
        },
        {
          element: '#Puzzle',
          popover: {
            title: 'Puzzle',
            description: `<h5> Unleash your skills, speed, and dominate leaderboards with the Puzzle Button!</h5>`
          },
          // onDeselected is called when the element is deselected.
          // Here we are simply removing the element from the DOM.
          // onPopoverRender:()=> {SPEAK("Unleash your skills, speed, and dominate leaderboards with the Puzzle Button!")},

          onDeselected: () => {
            // .. remove element
            document.querySelector(".dynamic-el")?.remove();
          }
        },
        {
          element: '#Learn',
          popover: {
            title: 'Learn',
            description: `<h5> Press here to unlock the world of chess: from basics to advanced strategies, master every move</h5>`
          },
          // onDeselected is called when the element is deselected.
          // Here we are simply removing the element from the DOM.
          // onPopoverRender:()=> {SPEAK("Press here to unlock the world of chess: from basics to advanced strategies, master every move")},

          // onDeselected: () => {
          //   // .. remove element
          //   document.querySelector(".dynamic-el")?.remove();
          // }
        },
        {
          element: '#Leaderboard',
          popover: {
            title: 'Leaderboard',
            description: `<h5> This one's your go-to for Checking Standings: Global Rankings, Friend Comparisons, Puzzle Leaderboard.</h5>`
          },
          // onDeselected is called when the element is deselected.
          // Here we are simply removing the element from the DOM.
          // onPopoverRender:()=> {SPEAK("This one's your go-to for Checking Standings: Global Rankings, Friend Comparisons, Puzzle Leaderboard.")},

          // onDeselected: () => {
          //   // .. remove element
          //   document.querySelector(".dynamic-el")?.remove();
          // }
        },
        {
          element: '#Support',
          popover: {
            title: 'Support',
            description: `<h5> Looking for help? Check out FAQs, Contact Us, and the Community Forum all in one place!</h5>`
          },
          // onDeselected is called when the element is deselected.
          // Here we are simply removing the element from the DOM.
          // onPopoverRender:()=> {SPEAK("Looking for help? Check out FAQs, Contact Us, and the Community Forum all in one place!")},

          // onDeselected: () => {
          //   // .. remove element
          //   document.querySelector(".dynamic-el")?.remove();
          // }
        },
        {
          element: '#Settings',
          popover: {
            title: 'Settings',
            description: `<h5> This one's your go-to for Checking Standings: Global Rankings, Friend Comparisons, Puzzle Leaderboard.Press this button to personalize your experience: Customize themes, manage settings, and stay informed with your preferences.</h5>`
          },
          // onDeselected is called when the element is deselected.
          // Here we are simply removing the element from the DOM.
          // onPopoverRender:()=> {SPEAK("This one's your go-to for Checking Standings: Global Rankings, Friend Comparisons, Puzzle Leaderboard.Press this button to personalize your experience: Customize themes, manage settings, and stay informed with your preferences.")},

          // onDeselected: () => {
          //   // .. remove element
          //   document.querySelector(".dynamic-el")?.remove();
          // }
        },


      ]

    });

    if (!hasSeenTour) {
      driverObj.drive();
  }
  localStorage.setItem('hasSeenTour', 'true');


  return (
<></>
  );
};

export default Intro;