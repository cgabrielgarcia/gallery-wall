// Gallery Wall JS v2

$(document).ready(function() {

	var etsyListings;
	var selectedOrientation;

	// Page 2 - Wall options


	$('.bg-option').click(handleBgOptionClick);

	function handleBgOptionClick() {

		// Make sure only last clicked option shows selection border
		$('.bg-option').removeClass('selected');
		$(this).addClass('selected');


		var clickedBgStyle = $(this).css('background');

		// Match Preview Wall bg to selection's bg
		$('#preview-wall').css({ 'background' : clickedBgStyle, 'background-position' : 'top center', 'background-size' : 'auto 100%', 'background-repeat' : 'no-repeat' });

	}

	$('.arrange-option').click(handleArrangeOptionClick);

	function handleArrangeOptionClick() {

		// Make sure only last clicked option shows selection border
		$('.arrange-option').removeClass('selected');
		$(this).addClass('selected');


		// Create frames in Preview Wall
		var selectedArrangeNum = $(this).data('num');
		$('.appended').remove();

		if (selectedArrangeNum === 1) {
			$('#preview-wall').append('<ul class="print-slot-frame-holder appended" id="trio-portrait"><li class="print-slot-frame"></li><li class="print-slot-frame"></li><li class="print-slot-frame"></li></ul>');
			selectedOrientation = 'portrait';
		} else if (selectedArrangeNum === 2) {
			$('#preview-wall').append('<ul class="print-slot-frame-holder appended" id="quad-square"><li class="print-slot-frame"></li><li class="print-slot-frame"></li><li class="print-slot-frame"></li><li class="print-slot-frame"></li></ul>');
			selectedOrientation = 'square';
		}

		var selectedFrameColor = $('.frame-option.selected').css('background-color');
		$('.print-slot-frame').css('border-color', selectedFrameColor);

	}

	$('.frame-option').click(handleFrameOptionClick);

	function handleFrameOptionClick() {

		// Make sure only last clicked option shows selection border
		$('.frame-option').removeClass('selected');
		$(this).addClass('selected');

		// Match Preview Wall frame border color to selection's background color
		var clickedFrameColor = $(this).css('background-color');
		$('.print-slot-frame').css('border-color', clickedFrameColor);

	}

	// Choose prints event listener

	$('#choose-prints').click(function() {
		$('#step-1').addClass('hide');
		$('#step-2').addClass('hide');
		$('#step-3').addClass('hide');
		$('#ready-choose').addClass('hide');
		$('#step-4').removeClass('hide');
		$('#step-4').prepend('<h1>4. Click on a print to save to My Favorites, then drag and drop your Favorites into the frames below.</h1>');
		$('#preview-wall').insertAfter('#my-favorites-holder');
		pullEtsyImgs();
	});


	// Request the JSON, process it, and filter it by selected frame orientation to populate Prints Catalog area with Etsy images

	function pullEtsyImgs() {

		// var api_key = ;
		var etsyUrl = 'https://openapi.etsy.com/v2/shops/carlagabrielgarcia/listings/active.js?&includes=Images:1&api_key=' + api_key;

		return $.ajax({
			type: 'GET',
    	    url: etsyUrl,
    	    dataType: 'jsonp',
    	    success: function(data) {
    	    	$('#prints-catalog').empty();

                if (data.ok) {
                	etsyListings = data.results;

                	if (etsyListings.length > 0) {
            			var filteredListings = orientationFilter(etsyListings, selectedOrientation);
                		populateCatalog(filteredListings);
        			} else {
        			    $('<p>No results.</p>').appendTo('#prints-catalog');
        			} 
        		} else {
                    $('<p>No results.</p>').appendTo('#prints-catalog');
                    alert(data.error);
        		}
        	}	       
		});
	}

	function orientationFilter(listings, orientation) {

        var result;

        if (orientation === 'landscape') {

			result = listings.filter(function(listing) {
				return listing.Images[0].full_width > listing.Images[0].full_height;
			});
       
  		} else if (orientation === 'portrait') {

  			result = listings.filter(function(listing) {
				return listing.Images[0].full_width < listing.Images[0].full_height;
			});

        } else {
        	result = listings;
        }

        return result;
		
	}

	function populateCatalog(listings) {
		$('#prints-catalog').empty();
        $.each(listings, function(i,item) {
        	var etsyImgUrl = item.Images[0].url_570xN;
        	$('<div class="img-holder"></div>').append($('<div class="etsy-img"></div>').css({ 'background-image' : 'url(\'' + etsyImgUrl + '\')', 'background-size' : '100% auto', 'background-repeat' : 'no-repeat', 'class' : 'drag print-img' })).append($('<div class="overlay"><p>Add to Favorites</p></div>')).appendTo('#prints-catalog');
        });
	}



	// Drag and drop prints

	// Populate My Favorites with clicked Prints -- DOESN'T WORK UNLESS I TYPE INTO CONSOLE
	$('.overlay').click(addToFavorites);

	function addToFavorites() {
		var etsyImgBg = $(this).siblings().css('background-image');
		$('<div class="favorite-img drag"></div>').css({ 'background-image' : etsyImgBg, 'background-size' : '100% auto', 'background-repeat' : 'no-repeat', 'class' : 'drag print-img' }).appendTo($('#my-favorites'));
	}


	// Make Favorite prints draggable -- DOESN'T WORK UNLESS I TYPE INTO CONSOLE

	$('.drag').draggable({
		containment: 'document',
			cursor: 'move',
			helper: function() {
				var draggedBg = $(this).css('background-image');
				return $('.small-helper.hidden').clone().removeClass('hidden').css({ 'background-image' : draggedBg , 'background-repeat' : 'no-repeat' });
			},
			cursorAt: {
				top: 5,
				left: 5
			}
	});

	// Make frames accept dragged prints

	$('.drop').droppable({
		drop: function handleDrop(event, ui) {
			var helperBg = $('.small-helper.ui-draggable-dragging').css('background-image');
			$(this).css({ 'background-image': helperBg, 'background-size' : '100% auto', 'background-repeat' : 'no-repeat' });
		}
	});
	
	// Remove dropped print on click

	$('.print-slot-frame.drop').click(function(event, ui) {
		$(this).css({ 'background-image': 'url(css/images/greyfloral_@2X.png)', 'background-repeat' : 'repeat' });
	})


});












