import React, { useEffect } from 'react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import {SPEAK} from '../../Middleware/Utils/Speak'
import './Intro.css'

function Intro() {
  const hasSeenTour = localStorage.getItem('hasSeenTour');
  const steps= [
    {
      popover: {
        title: 'Welcome to SIGARAM64',
        description:`Get ready for the Website Tour - Your Chess Mastery Journey Begins Here!`,
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
        description: `Hey there, Charm! I'm your guide to this chess wonderland! Let's embark on an interactive tour where I'll unveil all the amazing features this website has in store for you. Ready for an exciting journey through the world of chess mastery? Let's get started!`
      },
      // onDeselected is called when the element is deselected.
      // Here we are simply removing the element from the DOM.
      // onPopoverRender:()=> {SPEAK("Hey there, Charm! I'm your guide to this chess wonderland! Let's embark on an interactive tour where I'll unveil all the amazing features this website has in store for you. Ready for an exciting journey through the world of chess mastery? Let's get started!")},

    },
    {
      element: '#HomeNav',
      popover: {
        title: 'Home',
        description: `Hit Home and let's make chess learning a blast!`
      },
      // onDeselected is called when the element is deselected.
      // Here we are simply removing the element from the DOM.
      // onPopoverRender:()=> {SPEAK("Hit Home and let's make chess learning a blast!")},


    },
    {
      element: '#Play',
      popover: {
        title: 'Play',
        description: `Discover endless fun at your fingertips! Challenge friends, face random players, or conquer AI opponents with our dynamic play button`
      },
      // onDeselected is called when the element is deselected.
      // Here we are simply removing the element from the DOM.
      // onPopoverRender:()=> {SPEAK("Discover endless fun at your fingertips! Challenge friends, face random players, or conquer AI opponents with our dynamic play button")},
    },
    {
      element: '#Puzzle',
      popover: {
        title: 'Puzzle',
        description: `Unleash your skills, speed, and dominate leaderboards with the Puzzle Button!`
      },
      // onDeselected is called when the element is deselected.
      // Here we are simply removing the element from the DOM.
      // onPopoverRender:()=> {SPEAK("Unleash your skills, speed, and dominate leaderboards with the Puzzle Button!")},


    },
    {
      element: '#Learn',
      popover: {
        title: 'Learn',
        description: `Press here to unlock the world of chess: from basics to advanced strategies, master every move`
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
        description: `This one's your go-to for Checking Standings: Global Rankings, Friend Comparisons, Puzzle Leaderboard.`
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
        description: `Looking for help? Check out FAQs, Contact Us, and the Community Forum all in one place!`
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
        description: `This one's your go-to for Checking Standings: Global Rankings, Friend Comparisons, Puzzle Leaderboard.Press this button to personalize your experience: Customize themes, manage settings, and stay informed with your preferences.`
      },
      // onDeselected is called when the element is deselected.
      // Here we are simply removing the element from the DOM.
      // onPopoverRender:()=> {SPEAK("This one's your go-to for Checking Standings: Global Rankings, Friend Comparisons, Puzzle Leaderboard.Press this button to personalize your experience: Customize themes, manage settings, and stay informed with your preferences.")},

      // onDeselected: () => {
      //   // .. remove element
      //   document.querySelector(".dynamic-el")?.remove();
      // }
    },
  ];


  useEffect(() => {
    const driverObj = driver({
      keyboardControl: true,
      popoverClass: 'driverjs-theme',
      highlightClass: 'custom-highlight',
      showProgress: true,

      // allowClose: false,
      closeBtnText: 'Close',
      padding: 1,
      steps,
      onHighlighted: (tour, stepIndex) => {
       
        speak(tour.steps[stepIndex].popover.description);
      },
      // onHighlightStarted: (highlightedElement) => {
      //   console.log(highlightedElement);
      //   if (highlightedElement && highlightedElement.querySelector) {
      //     const descriptionElement = highlightedElement.querySelector('.driver-popover-description');
      //     console.log(descriptionElement);
      //     if (descriptionElement) {
      //       const description = descriptionElement.innerText;
      //       console.log(description);
      //       speak(description);
      //     }
      //   }
      // },

    });

    if (!hasSeenTour) {
      driverObj.drive();
  }
  localStorage.setItem('hasSeenTour', 'true');
  },[]);

  const speak = (text) => {
    SPEAK(text);
  };



  return (
<></>
  );
};

export default Intro;