import App from './App';

window.addEventListener('DOMContentLoaded', () => {
        let app = new App();
        app.init();
        if(window.screen && window.screen.orientation)
                screen.orientation.lock("portrait");
});

//on cancel les mouvements de swipe back sur mobile
/*
CA MARCHE PAS...
https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html
Ca devrait pourtant
let cancelEvents = ['gesturemove', 'gesturestart', 'touchmove', 'touchstart'];
cancelEvents.forEach(value => {
        document.addEventListener(value, function (e) {
                e.preventDefault();
        });

})*/