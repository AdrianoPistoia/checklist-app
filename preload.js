const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

  const slidingWindow = document.getElementById('tab'); // Adjust this to your sliding window's ID
  
  // Enable clicks when mouse enters the sliding window
  slidingWindow.addEventListener('mouseenter', () => {
    ipcRenderer.send('enable-click');
  });

  // Disable clicks when mouse leaves the sliding window
  slidingWindow.addEventListener('mouseleave', () => {
    ipcRenderer.send('disable-click');
  });

});
