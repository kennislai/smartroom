var activePanel = 2;
window.addEventListener("load", function () {
	swipeme();
 }, false);

function swipeme() {
	contentHolder = document.getElementById("irmHolder");
	irmPanel = document.getElementsByClassName("irm-panel");
	bullet = document.getElementsByClassName("bullet");
	swipeLink = document.getElementsByClassName("swipeLink");
	slides = document.getElementById("slides");
	totalCount = irmPanel.length - 1;
	counter = distanceX = distanceY = initialX = presentX = timePeriod = 0;

	for (i = 0; i < irmPanel.length; i++) {
		bullets.innerHTML += '<span class="bullet"></span>';
		irmPanel[i].style.zIndex = irmPanel.length - i;
		irmPanel[i].className = "irm-panel animate";
	}
  
  bullet[0].className = "bullet current";

	var theParent = document.querySelector("#slides");
	theParent.addEventListener('click', checkLink, false);

	function checkLink(event) {
    var classAttr = event.target.getAttribute('class');
		if (classAttr && classAttr.search("bullet") != -1) {
			var i = 0;
			prev = event.target.previousElementSibling;
			if (prev) {
				do ++i;
				while (prev = prev.previousElementSibling);
			}
			bulletClick(i);
		}
    else {
        return;
    }
      
		if (event.target !== event.currentTarget && distanceY == 0 && distanceY == 0 && timePeriod < 200) {
			var clickedItem = event.target.getAttribute('data-href');
			if (clickedItem) {
				alert(clickedItem);
			}
		}
		event.stopPropagation();
	}

	function bulletClick(clicked) {
		if (counter > clicked) {
			bullet[counter].className = "bullet";
			bullet[clicked].className = "bullet current";
			irmPanel[clicked].style.left = 0;
			irmPanel[counter].style.transform = 'scale(0.6)';
			irmPanel[counter].style.opacity = 0;
			for (i = clicked + 1; i < counter; i++) {
				irmPanel[i].style.transform = 'scale(0.6)';
				irmPanel[i].style.opacity = 0;
				irmPanel[i].style.left = 0;
			}
			counter = clicked;
			return false;
		}
		if (counter < clicked) {
			bullet[counter].className = "bullet";
			bullet[clicked].className = "bullet current";
			irmPanel[counter].style.left = "-100%";
			irmPanel[clicked].style.transform = 'scale(1)';
			irmPanel[clicked].style.opacity = 1;
			for (i = clicked - 1; i > counter; i--) {
				irmPanel[i].style.transform = 'scale(1)';
				irmPanel[i].style.opacity = 1;
				irmPanel[i].style.left = '-100%';
			}
			counter = clicked;
			return false;
		}
	}
	var myEfficientFn = debounce(function (event) {
			distanceX = event.deltaX;
			event.preventDefault();
			if (distanceX > 0 && counter < totalCount) {
				bullet[counter].className = "bullet";
				bullet[counter + 1].className = "bullet current";
				irmPanel[counter].style.left = "-100%";
				irmPanel[counter + 1].style.transform = 'scale(1)';
				irmPanel[counter + 1].style.opacity = 1;
				counter++;
			}
			if (distanceX < 0 && counter > 0) {
				bullet[counter].className = "bullet";
				bullet[counter - 1].className = "bullet current";
				irmPanel[counter - 1].style.left = 0;
				irmPanel[counter].style.transform = 'scale(0.6)';
				irmPanel[counter].style.opacity = 0;
				counter--;
			}
		}, 40);

	function debounce(func, wait) {
		immediate = true;
		var timeout;
		return function () {
			var context = this,
			args = arguments;
			var later = function () {
				timeout = null;
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow)
				func.apply(context, args);
		};
	};
	contentHolder.addEventListener('wheel', myEfficientFn, false);
	slides.addEventListener('touchstart', preventSlide, false);
	slides.addEventListener('mousedown', preventSlide, false);
	slides.addEventListener('wheel', preventSlide, false);

	function preventSlide(e) {
		if (Math.abs(e.deltaX) > 0) {
			e.preventDefault();
		}
	}
	contentHolder.addEventListener('touchstart', startTouch, false);
	contentHolder.addEventListener('mousedown', startMouse, false);

	function startTouch(event) {
		isTouchSupported = true;
		startEvent = 'touchstart';
		moveEvent = 'touchmove';
		endEvent1 = 'touchend';
		endEvent2 = 'touchcancel';
		contentHolder.removeEventListener('mousedown', startMouse, false);
		startHandler(event);
	}

	function startMouse(event) {
		event.preventDefault();
		isTouchSupported = false;
		startEvent = 'mousedown';
		moveEvent = 'mousemove';
		endEvent1 = 'mouseup';
		endEvent2 = 'mouseleave';
		contentHolder.removeEventListener('touchstart', startTouch, false);
		startHandler(event);
	}

	function startHandler(event) {
		contentHolder.addEventListener(moveEvent, moveHandler, false);
		contentHolder.addEventListener(endEvent1, endHandler1, false);
		contentHolder.addEventListener(endEvent2, endHandler2, false);
		for (i = 0; i < irmPanel.length; i++) {
			irmPanel[i].className = "irm-panel";
		}
		distanceX = distanceY = initialX = presentX = timePeriod = 0;
		changeSlide = swipe = false;
		imgWidth = irmPanel[0].offsetWidth;
		eventObj = isTouchSupported ? event.touches[0] : event;
		initialX = eventObj.pageX;
		initialY = eventObj.pageY;
		timeStarts = Date.now();
	}

	function moveHandler(event) {
		for (i = 0; i < irmPanel.length; i++) {
			irmPanel[i].className = "irm-panel";
		}
		eventObj = isTouchSupported ? event.touches[0] : event;
		presentX = eventObj.pageX;
		distanceX = parseInt((presentX - initialX));
		presentY = eventObj.pageY;
		distanceY = parseInt((presentY - initialY));
		abX = Math.abs(distanceX);
		abY = Math.abs(distanceY);
		if (!swipe && (abX < 2 * abY)) {
			changeSlide = false;
		} else {
			swipe = true;
			event.preventDefault();
		}
		if (swipe) {
			ratio = distanceX / imgWidth;
			if (distanceX < 0 && counter < totalCount) {
				irmPanel[counter].style.left = (distanceX) + "px";
				irmPanel[counter + 1].style.transform = 'scale(' + ((-ratio * 0.4) + 0.6) + ')';
				irmPanel[counter + 1].style.opacity = -ratio;
				changeSlide = true;
			}
			if (distanceX > 0 && counter > 0) {
				irmPanel[counter - 1].style.left = (-imgWidth + distanceX) + "px";
				irmPanel[counter].style.transform = 'scale(' + (1 - (ratio * 0.4)) + ')';
				irmPanel[counter].style.opacity = 1 - ratio;
				changeSlide = true;
			}
			if (distanceX < 0 && counter == totalCount) {
				irmPanel[counter].style.left = distanceX / 2 + "px";
			}
			if (distanceX > 0 && counter == 0) {
				irmPanel[counter].style.transform = 'scale(' + (1 - (ratio * 0.2)) + ')';
				irmPanel[counter].style.opacity = 1 - ratio * 0.8;
			}
		}
	}

	function endHandler2() {
		contentHolder.removeEventListener(endEvent1, endHandler1, false);
		contentHolder.removeEventListener(moveEvent, moveHandler, false);
		moveSlides();
		contentHolder.addEventListener('touchstart', startTouch, false);
		contentHolder.addEventListener('mousedown', startMouse, false);
	}

	function endHandler1() {
		contentHolder.removeEventListener(endEvent2, endHandler2, false);
		contentHolder.removeEventListener(moveEvent, moveHandler, false);
		moveSlides();
		contentHolder.addEventListener('touchstart', startTouch, false);
		contentHolder.addEventListener('mousedown', startMouse, false);
	}

	function moveSlides() {
		timeEnds = Date.now();
		timePeriod = timeEnds - timeStarts;
		if (timePeriod > 500) {
			changeSlide = false;
		}
		for (i = 0; i < irmPanel.length; i++) {
			irmPanel[i].className = "irm-panel animate";
		}
		if (distanceX < 0 && counter < totalCount && changeSlide) {
			bullet[counter].className = "bullet";
			bullet[counter + 1].className = "bullet current";
			irmPanel[counter].style.left = "-100%";
			irmPanel[counter + 1].style.transform = 'scale(1)';
			irmPanel[counter + 1].style.opacity = 1;
			counter++;
			return false;
		}
		if (distanceX > 0 && counter > 0 && changeSlide) {
			bullet[counter].className = "bullet";
			bullet[counter - 1].className = "bullet current";
			irmPanel[counter - 1].style.left = 0;
			irmPanel[counter].style.transform = 'scale(0.6)';
			irmPanel[counter].style.opacity = 0;
			counter--;
			return false;
		}
		if (distanceX > 0 && counter == 0) {
			irmPanel[counter].style.transform = 'scale(1)';
			irmPanel[counter].style.opacity = 1;
			return false;
		}
		if (distanceX < 0 && counter == totalCount) {
			irmPanel[counter].style.left = 0;
			return false;
		}
		if (distanceX > 0 && !changeSlide && counter <= totalCount && counter != 0) {
			irmPanel[counter - 1].style.left = "-100%";
			irmPanel[counter].style.transform = 'scale(1)';
			irmPanel[counter].style.opacity = 1;
			return false;
		}
		if (distanceX < 0 && !changeSlide && counter >= 0 && counter != totalCount) {
			irmPanel[counter].style.left = 0;
			irmPanel[counter + 1].style.transform = 'scale(0.6)';
			irmPanel[counter + 1].style.opacity = 0;
			return false;
		}
	}

  if (activePanel <= counter)
    bulletClick(activePanel);
}
