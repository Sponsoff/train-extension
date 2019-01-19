/* Listen for messages */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    /* If the received message has the expected format... */
    if (msg.text && (msg.text == "report_back")) {
        /* Call the specified callback, passing
           the web-pages DOM content as argument */
           sendResponse(document.getElementsByClassName("ytp-time-current")[0].innerHTML);
    } else if (msg.text && (msg.text == "toggle_on")) {
      on = true;
      appendButton("something", "/news_events/")
      sendResponse(true)
    } else if (msg.text && (msg.text == "get_on")) {
      sendResponse(on)
    }
});

let on = false;
let startTime = null;

function getId() {
  var url_string = window.location.href
  var url = new URL(url_string);
  var id = url.searchParams.get("v");
  return id
}

function appendButton(elementId, url){
	var buttonEl = document.createElement("a");
  buttonEl.id = 'record-ad-time'
  buttonEl.style.cursor = "pointer"
	buttonEl.onclick = () => {
    var thisButton = document.getElementById('record-ad-time');
    if (thisButton.innerText == "🚫") {
      let id = getId()
      thisButton.getElementsByTagName('span')[0].innerText = '👌'
      startTime = document.getElementsByClassName("ytp-time-current")[0].innerHTML
    } else if (thisButton.innerText == "👌") {
      let id = getId()
      thisButton.getElementsByTagName('span')[0].innerText = '☁️'
      let endTime = document.getElementsByClassName("ytp-time-current")[0].innerHTML
      axios.post('https://sponsorship-remover.herokuapp.com/add_time', {
        startTime: startTime,
        endTime: endTime,
        id: id
      })
      .then(async function (response) {
        startTime = null
        thisButton.getElementsByTagName('span')[0].innerText = '✅'
        await new Promise(resolve => setTimeout(resolve, 1000));
        thisButton.getElementsByTagName('span')[0].innerText = '🚫'
      })
      .catch(async function (error) {
        startTime = null
        thisButton.getElementsByTagName('span')[0].innerText = '❎'
        await new Promise(resolve => setTimeout(resolve, 1000));
        thisButton.getElementsByTagName('span')[0].innerText = '🚫'
      });
    }
  };
	var buttonTextEl = document.createElement("span");
	buttonTextEl.innerText = "🚫";
  buttonTextEl.style.marginLeft = "10px";
	buttonEl.appendChild(buttonTextEl);
  var referenceNode = document.getElementsByClassName('ytp-time-display')[0]
	//referenceNode.parentNode.insertBefore(buttonEl, referenceNode.nextSibling);
  referenceNode.appendChild(buttonEl);
}

//appendButton("something", "/news_events/")
/*
console.log('hi', document.readyState)
document.body.style.background = 'yellow';
if( document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log( 'document is already ready, just execute code here' );
    myInitCode();
} else {
    console.log('document not ready yet')
    document.addEventListener('DOMContentLoaded', function () {
        console.log( 'document was not ready, place code here' );
        myInitCode();
    });
}

function myInitCode() {
  console.log('dom loaded')
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', () => {
      console.log('clicked')
    });
  }
}
*/
