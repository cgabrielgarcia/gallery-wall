// Gallery Wall JS v2

$(document).ready(function() {

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

		// how to write as switch so can keep adding other cases/options later?

		if (selectedArrangeNum === 1) {
			$('#preview-wall').append('<ul class="print-slot-frame-holder appended" id="trio-portrait"><li class="print-slot-frame"></li><li class="print-slot-frame"></li><li class="print-slot-frame"></li></ul>');
		} else if (selectedArrangeNum === 2) {
			$('#preview-wall').append('<ul class="print-slot-frame-holder appended" id="quad-square"><li class="print-slot-frame"></li><li class="print-slot-frame"></li><li class="print-slot-frame"></li><li class="print-slot-frame"></li></ul>');
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


	// Page 3 - Drag and drop prints


	// Request the JSON and process it to populate Prints Catalog area with Etsy images

	function pullEtsyImgs() {

		// var api_key = ;
		var etsyUrl = 'https://openapi.etsy.com/v2/shops/carlagabrielgarcia/listings/active.js?limit=2&includes=Images:1&api_key=' + api_key;

		return $.ajax({
			type: 'GET',
    	    url: etsyUrl,
    	    dataType: 'jsonp',
    	    success: function(data) {
                if (data.ok) {
                    $('#prints-catalog').empty();
                    if (data.count > 0) {
                        $.each(data.results, function(i,item) {
                        	var etsyImgUrl = item.Images[0].url_570xN;
                            $('<img/>').attr({ 'src' : etsyImgUrl, 'class' : 'drag' }).appendTo('#prints-catalog');  
                            $('.drag').draggable({
    							containment: 'document',
    							cursor: 'move',
    							helper: function() {
    								var clickedUrl = $(this).attr('src');
    								return $('.small-helper.hidden').clone().removeClass('hidden').css({ 'background-image' : 'url(\'' + clickedUrl + '\')' , 'background-repeat' : 'no-repeat' });
    							},
    							cursorAt: {
    								top: 5,
    								left: 5
    							}
   							});
                        });
                    } else {
                        $('<p>No results.</p>').appendTo('#prints-catalog');
                    }
                } else {
                    $('#prints-catalog').empty();
                    alert(data.error);
                }
            }
		});

	}

	pullEtsyImgs();

	// Make frames accept dragged prints

	$('.drop').droppable({
		drop: function handleDrop(event, ui) {
			var helperBgUrl = $('.small-helper.ui-draggable-dragging').css('background-image');
			$(this).css({ 'background-image': helperBgUrl, 'background-size' : '100% auto', 'background-repeat' : 'no-repeat' });
		}
	});
	
	// Remove dropped print on click

	$('.print-slot-frame.drop').click(function(event, ui) {
		$(this).css({ 'background-image': 'url(css/images/greyfloral_@2X.png)', 'background-repeat' : 'repeat' });
	})



});













