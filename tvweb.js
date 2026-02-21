var cookie_prefix = "tvo_";

function getCookie(name){
    return Cookies.get(cookie_prefix + name);
}

function setCookie(name, value, attributes ){
    return Cookies.set(cookie_prefix + name, value, attributes);
}

function removeCookie(name){
    Cookies.remove(cookie_prefix + name);
}


window.addEventListener('pageshow', function(e){
    var forms = $(document).find('form');
    forms.each( function( i ){
        if( $(this).data('submitted') === true ){
            $(this).data('submitted', false);

            if ( $( this ).has( '#captcha_control' ) ) $( this ).find( '#captcha_reload' ).parent().click();
        }
    });
});

//close Tooltip by escape
window.addEventListener('keydown',
function (event){
        if(event.key ==="Escape"){
            if(document.activeElement.hasAttribute("data-toggle", "popover")){
                var popovers = document.getElementsByClassName("popover")
                popovers[0].remove();
            }
        }
});

window.addEventListener( 'resize', changeTabular );
window.addEventListener( 'resize', setFilterLabel );
window.addEventListener( 'resize', changeCheckboxLabel );

function changeCheckboxLabel(){
    $( "input[type=checkbox]+span+span" ).each( function () {
        var lineheight = parseInt( $( this ).css( "line-height" ).substr( 0, $( this ).css( "line-height" ).length - 1 ) );
        var hoehe = parseInt( $( this ).height() );
        if ( lineheight == hoehe ) {
            $( this ).css( "margin-top", "9px" );
            if ( $( this ).hasClass( "privacy_check_span" ) ) {
                $( "#saveCookieTooltip" ).eq( 0 ).css( "margin-top", "9px" );
            }
        }

    } );

    $( '.map_legend_entry' ).each( function () {
        var line;
        var aktline;
        if ( $( this ).find( '.map_legend_text' ).length == 0 ) {
            line = $( this ).find( '.map_legend_text_2_lines' ).css( 'line-height' );
            aktline = $( this ).find( '.map_legend_text_2_lines' ).height();
        } else {
            line = $( this ).find( '.map_legend_text' ).css( 'line-height' );
            aktline = $( this ).find( '.map_legend_text' ).height();
        }
        var lineheight = parseFloat( line.substr( 0, line.length - 2 ) );
        // if ( aktline > lineheight ) {
        //     $( this ).find( '.map_legend_icon' ).css( 'margin-top', '8px' );
        // } else {
        //     $( this ).find( '.map_legend_icon' ).css( 'margin-top', '0px' );
        // }
    } );
}

function summary_toggle( summary ){
    let $details = summary.parent();
    let $icon = summary.find( "span" );
    let $content = $details.find( "div.ui-accordion-content" );
    if( summary.hasClass( "ui-accordion-header-active" ) ){
        //close
        $details.removeAttr( "isOpen" );
        summary.removeClass( "ui-accordion-header-active" );
        summary.removeClass( "ui-state-active" );
        summary.addClass( "ui-accordion-header-collapsed" );
        $icon.removeClass( "ui-icon-triangle-1-s" );
        $icon.addClass( "ui-icon-triangle-1-e" );
        $content.slideUp( 500 ).promise().done( function(){
            $content.removeAttr( "style" );
            $details.removeAttr( "open" );
        } );
    } else {
        //open
        summary.siblings( ".ui-accordion-content" ).css( "display", "none" );
        summary.addClass( "ui-accordion-header-active" );
        summary.addClass( "ui-state-active" );
        summary.removeClass( "ui-accordion-header-collapsed" );
        $icon.addClass( "ui-icon-triangle-1-s" );
        $icon.removeClass( "ui-icon-triangle-1-e" );
        $details.attr( "open", true );
        $content.slideDown( 500 ).promise().done( function(){
            $content.removeAttr( "style" );
        } );
    }
}

function setFilterLabel(){
    if( $( window ).width() < 500 ){
        if( $( '#filterlabel' ) && $( "#filterlabel" ).prev().prop( "tagName" ) == "BUTTON" ){
            $( "<br>" ).insertBefore( $( "#filterlabel" ) );
            $( '#filterlabel' ).css( "margin-right", "5px" );
            $( '#filterlabel' ).css( "margin-left", "0px" );
        }
    } else {
        if( $( "#filterlabel" ) && $( '#filterlabel' ).prev().prop( "tagName" ) == "BR" ){
            $( '#filterlabel' ).prev().remove();
            $( '#filterlabel' ).css( "margin-right", "0px" );
            $( '#filterlabel' ).css( "margin-left", "20px" );
        }
    }
}

function changeTabular(){
    if( $( window ).width() <= 1000 ){
        if ( $( '.sugg_table' ).eq( 0 ).find( 'tr' ).eq( 0 ).find( 'td' ).find( 'button' ).hasClass( 'suggest_btn_5' ) ) { //5 min Raster
            if( $( '.sugg_table' ).eq( 0 ).find( "tr" ).eq( 0 ).find( "td" ).length == 12 ){
                $( '.sugg_table' ).find( "tr" ).each( function () {
                    let clone = $( this ).clone( true );
                    $( this ).find( "td:gt(5)" ).remove();
                    clone.find( "td:lt(6)" ).remove();
                    let spanElements = clone.find( "span" );
                    let uhrzeit = spanElements.eq( 0 ).html(); //Uhrzeit xx:00 - xx:xx
                    let uhr1 = uhrzeit.substring( 0, 2 ); //erste angegebene Uhrzeit
                    let uhr2 = uhrzeit.substring( 8, 10 ); //zweite angegebene Uhrzeit
                    spanElements.eq( 0 ).html( uhr1+ ":30 - " + uhr2 + ":00");
                    spanElements.eq( 1 ).html( uhr1 + " Uhr 30 bis " + uhr2 + " Uhr");
                    $( this ).find( "span" ).eq( 0 ).html( uhr1 + ":00 - " +uhr1 + ":30");
                    $( this ).find( "span" ).eq( 1 ).html( uhr1 + " Uhr 30 bis " + uhr2 + " Uhr");
                    if ( clone.find( "button:disabled" ).length == 6 ) {
                        clone.remove();
                    } else {
                        //wenn es noch Termine im zweiten Block zu vergeben gibt
                        clone.insertAfter( $( this ) );
                    }
                    if ( $( this ).find( "button:disabled" ).length == 6 ) {
                        //wenn es keine Termine im ersten Block mehr gibt
                        $( this ).remove();
                    }
                } );
            }
        } else {
            //anderes Raster
            if( $( '.sugg_table' ).eq( 0 ).find( "tr" ).eq( 0 ).find( "td" ).length == 6 ){
                //10 Min-Raster
                if( $( window ).width() >= 690 ){
                    $( '.sugg_table' ).find( "tr" ).find( "td" ).each( function(){
                        $( this ).find( "button" ).css( "padding", "0px 20px" );
                    } );
                } else {
                    if( $( window ).width() > 360 && $( window ).width() <= 689 ){
                        $( '.sugg_table' ).find( "tr" ).find( "td" ).each( function(){
                            $( this ).find( "button" ).css( "padding", "0px 6px" );
                        } );
                    } else {
                        $( '.sugg_table' ).each( function(){
                            $( this ).parent().css( "padding", "1em 0.7em" );
                        } );
                        $( '.sugg_table' ).find( "tr" ).find( "td" ).each( function(){
                            $( this ).find( "button" ).css( "padding", "0px 2px" );
                        } );
                    }
                }
            }

            if( $( '.sugg_table' ).eq( 0 ).find( "tr" ).eq( 0 ).find( "td" ).length == 4 ){
                //15 Min-Raster
                if( $( window ).width() < 580 ){
                    $( '.sugg_table' ).find( "tr" ).find( "td" ).each( function(){
                        $( this ).find( "button" ).css( "padding", "0 8px" );
                    } );
                }
            }
        }
    }

    let firstrow;
    let spanelement1;
    let uhrzeit1stunde;
    let uhrzeit1minuten;
    let secondrow;
    let spanelement2;
    let uhrzeit2stunde;
    let uhrzeit2minuten;
    let secondrowtd;
    let newrow;
    let $time_start;
    let $zeit;
    if( $( window ).width() > 1000 &&
        $( '.sugg_table' ).eq( 0 ).find( "tr" ).eq( 0 ).find( "td" ).length == 6 &&
        $( '.sugg_table' ).eq( 0 ).find( 'tr' ).eq( 0 ).find( 'td' ).find( 'button' ).hasClass( 'suggest_btn_5' )
    ){
        for( let $i = 0; $i < $( '.sugg_table' ).find( "tr" ).length; $i++ ){
            firstrow = $( '.sugg_table' ).find( "tr" ).eq( $i );
            spanelement1 = firstrow.find( "span" ).html();
            uhrzeit1stunde = spanelement1.substring( 0, 2 );
            uhrzeit1minuten = spanelement1.substring( 3, 5 );
            //falls Element $i+1 existiert...
            if( $i < $( '.sugg_table' ).find( "tr" ).length - 1 ){
                secondrow = $( '.sugg_table' ).find( "tr" ).eq( ( $i + 1 ) );
                spanelement2 = secondrow.find( "span" ).html();
                uhrzeit2stunde = spanelement2.substring( 0, 2 );
                uhrzeit2minuten = spanelement2.substring( 3, 5 );
            } else {
                uhrzeit2minuten = uhrzeit1minuten == "30" ? ( parseInt( uhrzeit1stunde ) + 1 ) + ":00" : uhrzeit1stunde + ":30";
            }
            //vergleich
            if( uhrzeit1stunde == uhrzeit2stunde && parseInt( uhrzeit1minuten ) < parseInt( uhrzeit2minuten ) ){
                //zeilen gehören zueinander: spalten rückgängig machen
                secondrowtd = secondrow.find( "td" ).clone( true );
                secondrowtd.insertAfter( firstrow.find( "td:eq(5)" ) );
                firstrow.find( "span" ).eq( 0 ).html( uhrzeit1stunde + ":00 - " + uhrzeit2stunde + ":00" );
                firstrow.find( "span" ).eq( 1 ).html( uhrzeit1stunde + " Uhr bis " + uhrzeit2stunde + " Uhr" );
                secondrow.remove();
            } else {
                //zweite zeile gehört zum neuen block -> auffüllen mit disabled elementen
                //option 1: erste zeile ist disabled -> erstes elemente beginnt mit :30
                newrow = '';
                firstrow.find( "span" ).eq( 0 ).html( uhrzeit1stunde + ":00 - " + ( parseInt( uhrzeit1stunde ) + 1 ) + ":00" );
                firstrow.find( "span" ).eq( 1 ).html( uhrzeit1stunde + " Uhr bis " + ( parseInt( uhrzeit1stunde ) + 1 ) + " Uhr" );
                if( parseInt( uhrzeit1minuten ) == 30 ){
                    for( let $j = 0; $j < 6; $j++ ){
                        if( $j == 0 || $j == 1 ){
                            $zeit = "0" + $j * 5;
                        } else {
                            $zeit = $j * 5;
                        }
                        $time_start = uhrzeit1stunde + ":" + $zeit;
                        newrow += '<td style="padding-right: 1px; padding-bottom: 1px;"><button type="button" class="suggest_btn btn btn-primary suggest_btn_5" disabled title="' + $time_start + '">' + $time_start + '</button></td>';
                    }
                    $( newrow ).insertBefore( firstrow.find( "td:eq(0)" ) );

                } else {
                    for( let $j = 0; $j < 6; $j++ ){
                        $time_start = uhrzeit1stunde + ":" + ( 30 + $j * 5 );
                        newrow += '<td style="padding-right: 1px; padding-bottom: 1px;"><button type="button" class="suggest_btn btn btn-primary suggest_btn_5" disabled title="' + $time_start + '">' + $time_start + '</button></td>';
                    }
                    $( newrow ).insertAfter( firstrow.find( "td:eq(5)" ) );
                }
            }
        }
    }
}

jQuery.fn.preventDoubleSubmission = function(){
    $( this ).on( 'submit', function( e ){
        var $form = $( this );

        if( $form.data( 'submitted' ) === true ){
            // Previously submitted - don't submit again
            e.preventDefault();
        } else {
            // Mark it so that the next submit can be ignored
            $form.data( 'submitted', true );
        }
    } );

    // Keep chainability
    return this;
};

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

var pdata_elements = [ 'nachname', 'vorname', 'email', 'emailCheck', 'phone', 'phone_mobile', 'geburtsdatumDay', 'geburtsdatumMonth', 'geburtsdatumYear', 'anschrift', 'hausnummer', 'plz', 'wohnort', 'nationality' ];

function historyGoBack( back_url ) {
	if(!back_url){
		back_url="";
	}
    var cookie_accept = getCookie('cookie_accept');

    if ( typeof cookie_accept === "undefined" ) cookie_accept = 0;

    if( window.location.pathname.indexOf('/personaldata') !== -1 && cookie_accept == 1 ){
        var cookie_path = window.location.pathname;
        cookie_path = cookie_path.slice( 0, cookie_path.lastIndexOf( "/" ) );
        var cookie_domain = window.location.host;

        $.each( pdata_elements, function( index, value ) {
            var input_name = 'input[name="' + value + '"]';
            var cookie_name = 'pdata_bak_' + value;
            if ( $( input_name ).length && $( input_name ).val() != '' )
                setCookie( cookie_name, $( input_name ).val(), {
                    path: cookie_path,
                    domain: cookie_domain,
                    secure: true,
                    samesite: 'None'
                } );
        });
    }

    if ( back_url !== '' ) {
        window.location.replace( back_url );
    } else {
        history.back();
    }
    return false;
}

let session_start = new Date;
$(document).ready(function (x) {

    //Automatisches Einblenden der Tooltips bei Mouse-Events
    // !!! Automatisches Ausblenden bei mouseleave entspricht nicht der BITV!!!
    /*$(".info-circle")
        .mouseover(function(){
            $(this).parent()[0].focus();
        })
    */


    changeCheckboxLabel();
    changeTabular();
    setFilterLabel();

    $('summary').each(function(){
        $details = $(this).parent();
        $summary = $(this);
        $icon= $(this).find("span");
        if(!$details.is('[isOpen]')){
            $summary.removeClass("ui-accordion-header-active");
            $summary.removeClass("ui-state-active");
            $summary.addClass("ui-accordion-header-collapsed");
            $icon.removeClass("ui-icon-triangle-1-s");
            $icon.addClass("ui-icon-triangle-1-e");
        }else{
            $details.attr("open", true);
        }
        this.addEventListener('click',
            function(e){
                e.preventDefault();
                summary_toggle($(this));
            });
    })

    if ( window.location.pathname === '/' ) {
        $.each( pdata_elements, function ( index, value ) {
            var cookie_name = 'pdata_bak_' + value;
            removeCookie( cookie_name );
        } );
    }

    if (document.head.querySelector('meta[name="viewport"]') !== null) {
        var iOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        if (iOS)
            document.head.querySelector('meta[name="viewport"]').content = "width=device-width, initial-scale=1, maximum-scale=1";
        else
            document.head.querySelector('meta[name="viewport"]').content = "width=device-width, initial-scale=1";
      }

    $( 'select' ).each( function () {
        $( this ).customA11ySelect();

        if ( $( this ).attr( "id" ) === "execution_type" && $( this ).hasClass( "select_set_disabled" ) ) {
            $( "#execution_type-label" ).addClass( "disabled_select" );

            $( "#execution_type-button" ).prop( "disabled", true );
            $( "#execution_type-button" ).addClass( "disabled_select" );
            $( "#execution_type-button" ).attr( "aria-disabled", true );

            $( "#execution_type-tooltip" ).parent().css( "display", "none" );
        }
    } );

    $('.tooltip').mouseenter(
        function () {
            var right = $(this).children('.classic').offset().left + $(this).children('.classic').outerWidth();
            if (right > $('body').width()) {
                var left = $(this).children('.classic').position().left;
                var newLeft = left - (right - $('body').width()) - 5;
                $(this).children('.classic').css('left', newLeft + 'px');
                $(this).children('.classic').append('<div id="oldLeftPos" style="display:none;">' + left + '</div>');
            }
        }
    );
    $( '.tooltip' ).mouseleave(
        function () {
            var left = $( this ).find( "div#oldLeftPos" ).html();
            $( this ).children( '.classic' ).css( 'left', left + 'px' );
            $( this ).find( "div#oldLeftPos" ).remove();
        }
    );

    $( function () {
        $( '[data-toggle="popover"]' ).popover( {
            container: 'body',
            trigger: 'focus',
            placement: 'bottom',
            html: true,
            content: function () {
                return $( this ).next( '.tvo_popover_content' ).html();
            }
        } );
    } );

    //plugin bootstrap minus and plus
//http://jsfiddle.net/laelitenetwork/puJ6G/
    $('.btn-number').click(function (e) {
        e.preventDefault();

        fieldName = $(this).attr('data-field');
        type = $(this).attr('data-type');
        var input = $("input[name='" + fieldName + "']");
        var currentVal = parseInt(input.val());
        if (!isNaN(currentVal)) {
            if (type == 'minus') {
                if (currentVal > input.attr('min')) {
                    input.val(currentVal - 1).change();
                }
                if (parseInt(input.val()) == input.attr('min')) {
                    $(this).attr("disabled", true);
                }

            } else if (type == 'plus') {

                if (currentVal < input.attr('max')) {
                    input.val(currentVal + 1).change();
                }
                if (parseInt(input.val()) == input.attr('max')) {
                    $(this).attr("disabled", true);
                }

            }
            var id = input.attr("id").match(/\d+/);
            var srtext = $("p[id='"+fieldName+"']");
            srtext[0].innerHTML= input.val() + " " + $('#cncSelected_str-' + id).val();
        } else {
            input.val(0);
        }
    });


    $('.input-number').focusin(function () {
        $(this).data('oldValue', $(this).val());
    });

    function checkInputValue($input){
        minValue = parseInt($input.attr('min'));
        maxValue = parseInt($input.attr('max'));
        valueCurrent = parseInt($input.val());

        if(valueCurrent < minValue){
            return -1;
        }else{
            if(valueCurrent > maxValue){
                return 1;
            }
            else{
                return 0;
            }
        }
    }
    $('.input-number').change(function () {

        returnvalue = checkInputValue($(this));
        switch (returnvalue){
            case 1: {
                $(this).val(0);
                let id = $(this).attr('id');
                if(!isDialogOpen)
                    showDialog($('#cncInputTooHigh_str-' + id).val(), $(this));
                break;
            }
            case -1:{
                $(this).val(0);
                let id = $(this).attr('id');
                if(!isDialogOpen)
                    showDialog($('#cncInputInvalid_str-'+id).val(), $(this));
                break;
            }
            default:{
                $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
                var id = $(this).attr('id');
                var maxValue = parseInt($('#' + id).attr('max'));
                var valueCurrent = parseInt($('#' + id).val());
                var cncID = parseInt($('#' + id).data('tevis-cncid'));

                if(valueCurrent >= maxValue) {
                    $('#button-plus-' + cncID).prop("disabled", true);
                    enableWeiterButton();
                }
            }

        }

    });

    $(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything

            returnvalue = checkInputValue($(this));
            var name = $(this).attr('name');

            switch (returnvalue) {
                case 1: {
                    $(".btn-number[data-type='minus'][data-field='" + name + "']").prop("disabled", "true");
                    let id = $(this).attr('id');
                    showDialog( $('#cncInputTooHigh_str-' + id).val(), $(this));
                    $(this).val(0);
                    break;
                }
                case -1: {
                    let id = $(this).attr('id');
                    showDialog( $('#cncInputInvalid_str-'+id).val(), $(this));
                    $(this).val(0);
                    break;
                }
                default: {
                    $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled');
                    return;
                }

            }
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    var extend_by = 3;
    $('#extend_today').click( function(e){
        var unhide_counter = 0;
        $( 'li.isHidden' ).each(function( index ) {

            if( unhide_counter === extend_by )
                return;

            $(this).removeClass('isHidden');
            unhide_counter++;
        });

        if( $( 'li.isHidden' ).length === 0 ){
            $('#extend_today').attr("disabled", "disabled");
        }
    });

    var cookie_accept = getCookie('cookie_accept');
    if( typeof cookie_accept === "undefined"){
        $('#cookie_msg').css('display', 'inline-block');
    }

    var cookie_path = window.location.pathname;
    cookie_path = cookie_path.slice( 0, cookie_path.lastIndexOf( "/" ) );
    var cookie_domain = window.location.host;

    // cookieMsgBtn
    $( '#cookie_msg_btn_yes' ).click( function () {
        setCookie( 'cookie_accept', 1, { path: cookie_path, domain: cookie_domain, secure: true, samesite: 'None' } );
        $( '#cookie_msg' ).css( 'display', 'none' );
    });
    $( '#cookie_msg_btn_no' ).click( function () {
        setCookie( 'cookie_accept', 0, { path: cookie_path, domain: cookie_domain, secure: true, samesite: 'None' } );
        $( '#cookie_msg' ).css( 'display', 'none' );
    } );

    $('#cal-reservation').preventDoubleSubmission();

    $('#rsvManager_table_filter').change(function(){
        $('#rsvManager_table_filter_form').submit();
    });

    $( function() {
        $( "#sugg_accordion" ).accordion( {
            heightStyle: "content",
            collapsible: true,
            create: function () {
                $( '#sugg_accordion' ).find( 'h3' ).attr( "tabindex", "0" );
            },
            activate: function () {
                $( '#sugg_accordion' ).find( 'h3' ).attr( "tabindex", "0" );
            }
        } );

        $( "#filter_accordion" ).accordion( {
            heightStyle: "content",
            collapsible: true,
            active: false
        } );

        $( "[id^=concerns_accordion-]" ).each(function(){
            $( "#" + this.id ).accordion( {
                heightStyle: "content",
                collapsible: true,
                active: $( "#" + this.id ).data( 'active' ),
                create: function(){
                    if ( $( "#" + this.id ).data( 'active' ) === 0 )
                        $( 'html, body' ).scrollTop( $( "#" + this.id ).offset().top );
                }
            } );
        });
        $( "#singleConcerns_accordion" ).accordion( { // "Sonstiges"-accordion
            heightStyle: "content",
            collapsible: true,
            active: $( "#singleConcerns_accordion" ).data( 'active' ),
            create: function(){
                if ( $( "#singleConcerns_accordion" ).data( 'active' ) === 0 )
                    $( 'html, body' ).scrollTop( $( "#" + this.id ).offset().top );
            }
        } );


        $( "#rsv_wish_accordion_weekday" ).accordion( {
            heightStyle: "content",
            collapsible: true,
            active: $( "#rsv_wish_accordion_weekday" ).data( 'active' ),
        } );

        $( "#suggest_location_accordion" ).accordion( {
            heightStyle: "content",
            collapsible: true,
            active: $( "#suggest_location_accordion" ).data( 'active' ),
            create: function () {
                $( '#suggest_location_accordion' ).find( 'h3' ).attr( "tabindex", "0" );
            },
            activate: function () {
                $( '#suggest_location_accordion' ).find( 'h3' ).attr( "tabindex", "0" );
            }
        } );
    } );

    $.datepicker.setDefaults({
        showOn: "both",
        buttonText: "Kalender",
    });

    $('.suggest_date').on("change", function(){
        let date = $(this).val();
        let isValid = isValidDate(date);
        if( isValid.valid ){
            $(this).removeClass( "wrongvalidate" );
            $(this).next(".error-text").removeAttr("cnw-original-text-0 cnw-current-language-0");
            $(this).next(".wrongvalidateimg_suggest_filter_date").remove();

            let date1 = $('#filter_date_from').datepicker('getDate');
            let date2 = $('#filter_date_to').datepicker('getDate');

            if( date1 > date2 ){
                let val1 = $('#filter_date_from').val();
                let val2 = $('#filter_date_to').val();
                $('#filter_date_to').datepicker('setDate', date1);
                $('#filter_date_to').val(val1);
                $('#filter_date_from').datepicker('setDate', date2);
                $('#filter_date_from').val(val2);
            }
        } else {
            $(this).addClass( "wrongvalidate" );
            $('.error-text').html(isValid.message);
            $(this).next(".error-text").removeAttr("cnw-original-text-0 cnw-current-language-0");
            $('<img aria-hidden="true" class="wrongvalidateimg_suggest_filter_date"></img>').insertAfter($(this));
        }
        checkFilter();
    });

    function isValidDate(dateString){

        let result = {
            valid: false,
            message: ""
        };

        if(!/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(dateString)) {
            result.message = "Datum bitte im Format TT.MM.JJJJ eingeben.";
            return result;
        }

        const parts = dateString.split(".");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        if(year < 2024 || year > 3000 || month === 0 || month > 12) {
            result.message = "Unzulässiges Datum";
            return result;
        }

        let monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        if(day > 0 && day <= monthLength[month - 1]) {
            result.valid = true;
            return result;
        }
        else {
            result.message = "Unzulässiges Datum";
            return result;
        }
    }

    function checkFilter(){
        const existerror = $(".wrongvalidate").length > 0;

        if( existerror ){
            buttontext = "Unzulässiges Datum";
        } else {
            buttontext = "Filtern";
            $('.error-text').html("");
        }

        if( existerror ){
            $("[name='suggest_filter']").addClass("disabledButton");
            $("[name='suggest_filter']").attr("aria-disabled", "true");
            $("[name='suggest_filter']").attr("title", buttontext);
            $("#srhinweis").html(buttontext);
            $("[name='suggest_filter']").on("click", function(event){
                event.preventDefault();
            });
        } else {
            $("#srhinweis").html("[[Sie können nun zum nächsten Schritt der Terminreservierung gehen.]]")
            $("[name='suggest_filter']").removeClass("disabledButton");
            $("[name='suggest_filter']").attr("aria-disabled", "false");
            $("[name='suggest_filter']").attr("title", buttontext);
            $("[name='suggest_filter']").unbind();
        }
    }

    var nationalities = [
        {value: "423", label: "Afghanistan"},{value: "121", label: "Albanien"},{value: "221", label: "Algerien"},{value: "123", label: "Andorra"},{value: "223", label: "Angola"},{value: "320", label: "Antigua und Barbuda"},{value: "323", label: "Argentinien"},{value: "422", label: "Armenien"},{value: "S01", label: "ARUBA"},{value: "425", label: "Aserbaidschan"},{value: "523", label: "Australien"},{value: "S11", label: "AUTRE"},{value: "324", label: "Bahamas"},{value: "424", label: "Bahrain"},{value: "460", label: "Bangladesch"},{value: "322", label: "Barbados"},{value: "124", label: "Belgien"},{value: "330", label: "Belize"},{value: "229", label: "Benin"},{value: "426", label: "Bhutan"},{value: "326", label: "Bolivien"},{value: "S02", label: "BOPHUTHATSWANA"},{value: "122", label: "Bosnien und Herzegowina"},{value: "227", label: "Botsuana"},{value: "327", label: "Brasilien"},{value: "295", label: "Britisch abhängige Gebiete in Afrika"},{value: "395", label: "Britisch abhängige Gebiete in Amerika"},{value: "495", label: "Britisch abhängige Gebiete in Asien"},{value: "595", label: "Britisch abhängige Gebiete in Australien"},{value: "195", label: "Britisch abhängige Gebiete in Europa"},{value: "429", label: "Brunei Darussalam"},{value: "125", label: "Bulgarien"},{value: "258", label: "Burkina Faso"},{value: "291", label: "Burundi"},{value: "332", label: "Chile"},{value: "479", label: "China"},{value: "S03", label: "CISKEI"},{value: "527", label: "Cookinseln"},{value: "334", label: "Costa Rica"},{value: "231", label: "Cote d'Ivoire"},{value: "000", label: "Deutschland"},{value: "333", label: "Dominica"},{value: "335", label: "Dominikanische Republik"},{value: "230", label: "Dschibuti"},{value: "126", label: "Dänemark"},{value: "336", label: "Ecuador"},{value: "337", label: "El Salvador"},{value: "224", label: "Eritrea"},{value: "127", label: "Estland"},{value: "526", label: "Fidschi"},{value: "128", label: "Finnland"},{value: "990", label: "Fluechtl. gem. Konvention 1954"},{value: "991", label: "Fluechtling (Sonstiger)"},{value: "129", label: "Frankreich"},{value: "236", label: "Gabun"},{value: "237", label: "Gambia"},{value: "465", label: "Gebiet Taiwan"},{value: "430", label: "Georgien"},{value: "238", label: "Ghana"},{value: "340", label: "Grenada"},{value: "134", label: "Griechenland"},{value: "168", label: "Großbritannien"},{value: "345", label: "Guatemala"},{value: "261", label: "Guinea"},{value: "259", label: "Guinea-Bissau"},{value: "328", label: "Guyana"},{value: "346", label: "Haiti"},{value: "347", label: "Honduras"},{value: "S05", label: "HONG KONG CHINE"},{value: "S04", label: "HONG KONG GB"},{value: "436", label: "Indien"},{value: "437", label: "Indonesien"},{value: "992", label: "Intern. Komitee Rotes Kreuz"},{value: "438", label: "Irak"},{value: "439", label: "Iran, Islamische Republik"},{value: "135", label: "Irland"},{value: "136", label: "Island"},{value: "441", label: "Israel"},{value: "137", label: "Italien"},{value: "355", label: "Jamaika"},{value: "442", label: "Japan"},{value: "421", label: "Jemen"},{value: "443", label: "Jemen"},{value: "445", label: "Jordanien"},{value: "138", label: "Jugoslawien"},{value: "446", label: "Kambodscha"},{value: "262", label: "Kamerun"},{value: "348", label: "Kanada"},{value: "242", label: "Kap Verde"},{value: "444", label: "Kasachstan"},{value: "447", label: "Katar"},{value: "243", label: "Kenia"},{value: "450", label: "Kirgisistan"},{value: "530", label: "Kiribati"},{value: "349", label: "Kolumbien"},{value: "244", label: "Komoren"},{value: "245", label: "Kongo"},{value: "246", label: "Kongo, Dem. Republik"},{value: "434", label: "Korea, Dem. Volksrepublik"},{value: "467", label: "Korea, Republik"},{value: "150", label: "Kosovo"},{value: "130", label: "Kroatien"},{value: "351", label: "Kuba"},{value: "448", label: "Kuwait"},{value: "449", label: "Laos, Demokratische Volksrepublik"},{value: "226", label: "Lesotho"},{value: "139", label: "Lettland"},{value: "451", label: "Libanon"},{value: "247", label: "Liberia"},{value: "248", label: "Libysch-Arabische Dschamahirija"},{value: "141", label: "Liechtenstein"},{value: "142", label: "Litauen"},{value: "143", label: "Luxemburg"},{value: "S06", label: "MACAO"},{value: "249", label: "Madagaskar"},{value: "256", label: "Malawi"},{value: "482", label: "Malaysia"},{value: "454", label: "Malediven"},{value: "251", label: "Mali"},{value: "145", label: "Malta"},{value: "252", label: "Marokko"},{value: "544", label: "Marshallinseln"},{value: "239", label: "Mauretanien"},{value: "253", label: "Mauritius"},{value: "144", label: "Mazedonien"},{value: "353", label: "Mexiko"},{value: "545", label: "Mikronesien, Föderierte Staaten von"},{value: "146", label: "Moldau, Republik"},{value: "147", label: "Monaco"},{value: "457", label: "Mongolei"},{value: "140", label: "Montenegro"},{value: "254", label: "Mosambik"},{value: "427", label: "Myanmar"},{value: "267", label: "Namibia"},{value: "531", label: "Nauru"},{value: "458", label: "Nepal"},{value: "536", label: "Neuseeland"},{value: "354", label: "Nicaragua"},{value: "148", label: "Niederlande"},{value: "255", label: "Niger"},{value: "232", label: "Nigeria"},{value: "533", label: "Niue"},{value: "149", label: "Norwegen"},{value: "S09", label: "O.N.U."},{value: "999", label: "ohne Angabe"},{value: "456", label: "Oman"},{value: "461", label: "Pakistan"},{value: "993", label: "Palaestinen. Autonomiebehoerde"},{value: "537", label: "Palau"},{value: "S10", label: "PALESTINIEN"},{value: "459", label: "Palästinensische Gebiete"},{value: "357", label: "Panama"},{value: "538", label: "Papua-Neuguinea"},{value: "359", label: "Paraguay"},{value: "361", label: "Peru"},{value: "462", label: "Philippinen"},{value: "152", label: "Polen"},{value: "153", label: "Portugal"},{value: "277", label: "Republik Sudan"},{value: "265", label: "Ruanda"},{value: "154", label: "Rumänien"},{value: "160", label: "Russische Föderation"},{value: "524", label: "Salomonen"},{value: "257", label: "Sambia"},{value: "543", label: "Samoa"},{value: "156", label: "San Marino"},{value: "268", label: "Sao Tome und Principe"},{value: "472", label: "Saudi-Arabien"},{value: "157", label: "Schweden"},{value: "158", label: "Schweiz"},{value: "269", label: "Senegal"},{value: "133", label: "Serbien"},{value: "170", label: "Serbien"},{value: "132", label: "Serbien und Montenegro"},{value: "271", label: "Seychellen"},{value: "272", label: "Sierra Leone"},{value: "233", label: "Simbabwe"},{value: "474", label: "Singapur"},{value: "155", label: "Slowakei"},{value: "131", label: "Slowenien"},{value: "273", label: "Somalia"},{value: "299", label: "Sonstige Afrikanische Gebiete"},{value: "399", label: "Sonstige Amerikanische"},{value: "499", label: "Sonstige Asiatische Gebiete"},{value: "599", label: "Sonstige Australische Gebiete"},{value: "199", label: "Sonstige Europäische"},{value: "159", label: "Sowjetunion"},{value: "161", label: "Spanien"},{value: "431", label: "Sri Lanka"},{value: "370", label: "St. Kitts und Nevis"},{value: "366", label: "St. Lucia"},{value: "369", label: "St. Vincent und die Grenadinen"},{value: "997", label: "staatenlos"},{value: "276", label: "Sudan"},{value: "364", label: "Suriname"},{value: "281", label: "Swasiland"},{value: "263", label: "Südafrika"},{value: "278", label: "Südsudan"},{value: "475", label: "Syrien, Arabische Republik"},{value: "470", label: "Tadschikistan"},{value: "282", label: "Tansania, Vereinigte Republik"},{value: "476", label: "Thailand"},{value: "483", label: "Timor-Leste"},{value: "283", label: "Togo"},{value: "541", label: "Tonga"},{value: "S07", label: "TRANSKEY"},{value: "S12", label: "TREUHANDGEB.PAZIFISCHE INSELN"},{value: "371", label: "Trinidad und Tobago"},{value: "284", label: "Tschad"},{value: "164", label: "Tschechische Republik"},{value: "162", label: "Tschechoslowakei"},{value: "285", label: "Tunesien"},{value: "471", label: "Turkmenistan"},{value: "540", label: "Tuvalu"},{value: "163", label: "Türkei"},{value: "286", label: "Uganda"},{value: "166", label: "Ukraine"},{value: "165", label: "Ungarn"},{value: "998", label: "ungeklärt"},{value: "995", label: "UNHCR"},{value: "994", label: "UNITED NATIONS ORGANIZATION"},{value: "365", label: "Uruguay"},{value: "477", label: "Usbekistan"},{value: "532", label: "Vanuatu"},{value: "167", label: "Vatikanstadt"},{value: "S08", label: "VENDA"},{value: "367", label: "Venezuela"},{value: "469", label: "Vereinigte arabische Emirate"},{value: "368", label: "Vereinigte Staaten"},{value: "432", label: "Vietnam"},{value: "169", label: "Weißrussland"},{value: "289", label: "Zentralafrikanische Republik"},{value: "181", label: "Zypern"}
    ];


    if( window.location.pathname.indexOf('/personaldata') !== -1 && $( 'input[name="nationality"]' ).length ){ //
        var nationality_bak = $('#nationality').val();
        var nationality_key_bak = $('#nationality_key').val();
        $('#nationality').on('input', function(){
            if( $('#nationality').val() != nationality_bak )
                $('#nationality_key').val('');
            else
                $('#nationality_key').val( nationality_key_bak );
        });

        $( "#nationality" )
            .autocomplete({
                minLength: 0,
                source: nationalities,
                focus: function( event, ui ) {
                    $( "#nationality" ).val( ui.item.label );
                    return false;
                },
                select: function( event, ui ) {
                    $( "#nationality" ).val( ui.item.label );
                    $( "#nationality_key" ).val( ui.item.value );
                    return false;
                }
            })
            .autocomplete( "instance" )._renderItem = function( ul, item ) {
                return $( "<li>" ).append( "<div>" + item.label +  "</div>" ).appendTo( ul );
            };
    }


    $( function() {
        var cookie_accept = getCookie('cookie_accept');
        if( typeof cookie_accept === "undefined")
            cookie_accept = 0;

        if( window.location.pathname.indexOf('/personaldata') !== -1 && cookie_accept == 1 ) {
            $.each( pdata_elements, function( index, value ) {
                var input_name = 'input[name="' + value + '"]';
                var cookie_name = 'pdata_bak_' + value;
                if( $( input_name ).length && $( input_name ).val() == '' )
                    if( getCookie( cookie_name ) != undefined )
                        $( input_name ).val( getCookie( cookie_name ) );
            });
        }
    });

    $( '.corona_code_part' ).on('focus', function(){
        $(this).select();
    });

    $( '.corona_code_part' ).on('keyup', function(){
        if( this.value.length == this.maxLength ) {
            $(this).parent().next('.corona_code_part_wrap').find('.corona_code_part').focus();
        }
    });

    $('input[name="emailCheck"]').bind('copy paste cut', function(e){
        e.preventDefault();
    });

    if(getCookie("map_agreement") != 1){
        $("#loc_map").hide();
        $("#map_legend").hide();
    }

    $( 'a[href="#"]' ).click( function ( e ) {
        e.preventDefault();
    } );

    if ( $( '#session_reset_lifetime' ).length ) {
        var session_lifetime = parseInt( $( '#session_reset_lifetime' ).val() );
        trigger_session_timer( session_lifetime );

        setInterval( function (x) {
            var session_limit = session_lifetime - ( Math.round( (new Date - session_start) / 1000 ) );
            trigger_session_timer( session_limit );
        }, 1000 );
    }

    if ( $("#rsv_wish_accordion_weekdays").attr("data-active") == 0)
        $("#rsv_wish_accordion_weekdays").children('h3').eq(0).focus();

    $( '#easyLanguage' ).on( 'click', function ( e ) {
        if(getCookie("language") === "de_DE") {
            setCookie("language", "de_VS", {path: cookie_path, domain: cookie_domain, secure: true, samesite: 'None'});
            if ( typeof Conword === "object")
                Conword.unset_user_language();
        } else {
            setCookie("language", "de_DE", {path: cookie_path, domain: cookie_domain, secure: true, samesite: 'None'});
            if ( typeof Conword === "object")
                Conword.set_user_language('de');
        }
        location.reload();
    });


    if(getCookie("language") == "de_VS"){
        var easyLanguageOFF = $( '#easyLanguage' ).attr( 'data-easyLanguageOFF' );
        $( '#easyLanguage' ).attr( "title", easyLanguageOFF );
        $( '#easyLanguage' ).attr( "aria-label", easyLanguageOFF );
        $( '#easyLanguage' ).find( "img" ).eq( 0 ).attr( "src", "styles/web/basis/images/leichte_Sprache_inaktiv_252525.svg" );
        $( '#easyLanguage' ).find( "img" ).eq( 1 ).attr( "src", "styles/web/basis/images/leichte_Sprache_inaktiv_FFFFFF.svg" );
    } else {
        var easyLanguageON = $( '#easyLanguage' ).attr( 'data-easyLanguageON' );
        $( '#easyLanguage' ).attr( "title", easyLanguageON );
        $( '#easyLanguage' ).attr( "aria-label", easyLanguageON );
        $( '#easyLanguage' ).find( "img" ).eq( 0 ).attr( "src", "styles/web/basis/images/leichte_Sprache_aktiv_252525.svg" );
        $( '#easyLanguage' ).find( "img" ).eq( 1 ).attr( "src", "styles/web/basis/images/leichte_Sprache_aktiv_FFFFFF.svg" );
    }

}); // ENDE DOCUMENT READY

function trigger_session_timer( session_counter = 0 ){
    if ( $( "#session_reset_input" ).length ) {
        var minutes = parseInt( session_counter / 60 ) + 1;
        $( '#session_reset_input' ).text( minutes );
        var modalOpened= false;
        if ( session_counter == 60 ) {
            showFooterModals( "session", $( '#session_warning_str' ).val() );
            modalOpened = true;
        }
        //falls das Modal nicht geöffnet wurde, weil der counter (zufälligerweise) die 60 übersprungen hat
        if ( session_counter == 59 && !modalOpened )
            showFooterModals( "session", $( '#session_warning_str' ).val() );

        if ( session_counter <= 0 )
            reset_session();
    }
}

function reset_session(){
    if ( $('#footer_dialog').is(':visible') ) {
        window.location.href = "./?rs";
    } else {
        $.ajax({
            cache: false,
            type: "GET",
            url: "default",
            success: function (data) {
                //erneuter Start des Timers
                session_start = new Date();
            },
            error: function(xhr, status, error) {
                window.location.href = "./?rs";
            }
        });
    }
}


function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatTime( seconds ) {
    var minutes = parseInt( seconds / 60 ) + 1;
    var hours = parseInt( minutes / 60 );
    var output = '';

    if( hours > 0 ){
        if( hours === 1 )
            output += hours + ' Stunde';
        else
            output += hours + ' Stunden';
        minutes -= hours * 60;
    }

    if( minutes % 60 !== 0){
        if( hours > 0)
            output += ' und ';
        if( minutes === 1 )
            output += minutes + ' Minute';
        else
            output += minutes + ' Minuten';
    }

    return output;
}

function sortTable(n, sortable_table) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(sortable_table);
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        row_heading = rows[0].getElementsByTagName("TH");
        Array.prototype.forEach.call(row_heading, function(elem){
            if(elem.innerHTML.indexOf("↓") >=0) {
                elem.innerHTML = elem.innerHTML.replace("↓", "").trim();
            }
            if(elem.innerHTML.indexOf("↑")>=0) {
                elem.innerHTML = elem.innerHTML.replace("↑", "").trim();
            }
        });

        if(dir === "asc") {
            row_heading[n].innerHTML = row_heading[n].innerHTML + "&darr;";
        }
        else if(dir === "desc") {
            row_heading[n].innerHTML = row_heading[n].innerHTML + "&uarr;";
        }
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir === "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
        } else {
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function showFooterModals( type, title ) {
    $('#modal_help, #modal_imprint, #modal_privacy, #modal_accessibility, #modal_session, #modal_conword_translate_info, #modal_licenses').hide();
    $('#footer_dialog .modal-title').html( title );
    $('#footer_dialog').attr('aria-label',  $('#infofenster_str').val() + title);

    switch(type){
        case 'session':
            $('#modal_session').show();
            break;
        case 'help':
            $('#modal_help').show();
            break;
        case 'imprint':
            $('#modal_imprint').show();
            break;
        case 'privacy':
            $('#modal_privacy').show();
            break;
        case 'accessibility':
            $('#modal_accessibility').show();
            break;
        case 'conword_translate_info':
            $('#modal_conword_translate_info').show();
            break;
        case 'licenses':
            $('#modal_licenses').show();
            break;
    }
    $("#footer_dialog").modal({
        backdrop: "static",
        keyboard: false
    });
    $("#footer_dialog").on("shown.bs.modal", function(){
        $("#close_btn").focus();
    });
    document.addEventListener("keydown", function(){
     if(document.activeElement.id =="footer_dialog" && document.activeElement.className =="modal fade in"){
         document.getElementById("close_btn").children[0].focus();
     }
    });
    $("#footer_dialog").on("hidden.bs.modal", function(){
        switch(type){
            case 'help':
                $('#footer_link_help').focus();
                break;
            case 'imprint':
                $('#footer_link_imprint').focus();
                break;
            case 'privacy':
                $('#footer_link_privacy').focus();
                break;
            case 'accessibility':
                $('#footer_link_accessibility').focus();
                break;
            case 'conword_translate_info':
                $('#footer_link_conword_translate_info').focus();
                break;
            case 'licenses':
                $('#footer_link_licenses').focus();
                break;
        }
    });
}

function showMap( addresses, calendarView, map_marker_colors ) {
    //adressen nach index (reihenfolge: nächster freier termin) sortieren
    addresses = Object.values(addresses);
    addresses = addresses.sort((a, b) => a[7] - b[7]);

    if(!("local" in map_marker_colors) || map_marker_colors['local'] == "")
        map_marker_colors['local'] = "gold";

    if(!("possible" in map_marker_colors)|| map_marker_colors['possible'] == "")
        map_marker_colors['possible'] = "rgb(0, 56, 101)";

    if(!("possible_font" in map_marker_colors)|| map_marker_colors['possible_font'] == "")
        map_marker_colors['possible_font'] = "white";

    if(!("selected" in map_marker_colors)|| map_marker_colors['selected'] == "")
        map_marker_colors['selected'] = "green";

    if(!("selected_font" in map_marker_colors)|| map_marker_colors['selected_font'] == "")
        map_marker_colors['selected_font'] = "white";


    var latlonAddresses = [];
    var response = [];
    latlonAddresses = getLatLon( addresses );

    function getLatLon( addresses ) {
        if ( typeof addresses === 'array' ) {
            var addrLength = addresses.length;
        }
        if ( typeof addresses === 'object' ) {
            var addrLength = Object.keys( addresses ).length;
        }

        var callback = function () {
            for (let i = 0; i < addrLength; i++) {
                if ( response[ i ].length === 2 ) {
                    // array -> Lat/Long aus Tevis
                        latlonAddresses[ i ] = response[ i ];
                } else {
                    // string -> Daten online abgerufen
                    var osm_xml = response[ i ][ "responseText" ],
                        osm_xml_obj = $.parseXML( osm_xml ),
                        $osm_results = $( osm_xml_obj ).find( "searchresults" ),
                        $place = $osm_results.find( "place" );

                    if ( $place.length > 0 ) {
                        latlonAddresses[ i ] = [ $place.attr( 'lat' ), $place.attr( 'lon' ) ];
                    } else {
                        console.log( "Die Adresse '" + $osm_results.attr( 'querystring' ) + "' konnte nicht gefunden werden." );
                    }
                }
            }
            latlonAddresses = latlonAddresses.filter( Boolean );
            drawMap( latlonAddresses );
        };

        for ( let i = 0; i < addrLength; i++ ) {
            var str = addresses[ i ][ 0 ];
            var plz = addresses[ i ][ 1 ];
            var ort = addresses[ i ][ 2 ];
            var name = addresses[ i ][ 3 ];

            if ( addresses[ i ][ 5 ] !== undefined && addresses[ i ][ 5 ] !== null && addresses[ i ][ 5 ] !== '' &&
                 addresses[ i ][ 6 ] !== undefined && addresses[ i ][ 6 ] !== null && addresses[ i ][ 6 ] !== '' )
            {
                var lat = addresses[ i ][ 5 ];
                var lon = addresses[ i ][ 6 ];
                response.push( [ lat, lon ] );
            } else {
                var xmllink = encodeURI( 'https://nominatim.openstreetmap.org/search?q=' + str + ',' + plz + ',' + ort + '&format=xml&polygon=1&addressdetails=0&limit=1' );
                response.push( $.ajax( {
                    url: xmllink,
                    cache: false,
                    success: function () {
                        console.log( "Standort '" + name + "' geladen." );
                    },
                    error: function () {
                        console.log( "Keine Geodaten für Standort '" + name + "' gefunden!" )
                        console.log( "URL: '" + xmllink + "'" );
                    }
                } ) );
            }
        }

        $.when.apply( undefined, response ).then( function () {
            callback();
        } );

        return latlonAddresses;
    }

    function createMarker(lat, lon, color, ratio, number, fontColor = "white", iconSize = [25,41], weight = 1.5, legend = false ){
        var fontSize = 18;
        if(number>9)
            fontSize = 13;

        var marker = new L.Marker.SVGMarker([lat, lon], { iconOptions: { 
            circleBorderColor: "black",
            borderColor: "black",
            color: "black",
            fillColor: color,
            fillOpacity: 1,
            fontSize: fontSize,
            fontWeight: "bold",
            fontColor: fontColor,
            iconSize: iconSize,
            shadowEnable: true,
            shadowAngle: 10,
            shadowOpacity: 0.3,
            shadowLength: 0.5,
            weight: weight,
            circleWeight: weight,
            circleRatio: ratio,
            circleText: number,
            legend: legend,
        }});

        return marker;
    }

    function drawMap(latlonAddresses) {
        
        var mapOptions = {
            zoomControl: false
        }
        var map = L.map("loc_map", mapOptions).setView([51.54584, 7.68132], 18);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }).addTo(map);

        var zoomOptions = {
            zoomInTitle: 'Vergrößern',
            zoomOutTitle: 'Verkleinern',
         };
        L.control.zoom(zoomOptions).addTo(map);

        var markers = new L.featureGroup();

        $(function() {
                var selectedLocationId = $(":selected").attr("value");

                for (let i = 0; i < latlonAddresses.length; i++) {
                    if (calendarView == "suggest") {
                        var select_location_link =  '<form method="post">' +
                                                                '<input type="hidden" name="loc" value="' + addresses[i][4] + '" />' +
                                                                '<input type="hidden" name="gps_lat" value="' + addresses[i][5] + '" />' +
                                                                '<input type="hidden" name="gps_long" value="' + addresses[i][6] + '" />' +
                                                                '<input type="submit" name="select_location" class="btn btn-primary map_loc_btn" style="border: none!important" value="Standort auswählen"/>' +
                                                            '</form>';
                    } else if (calendarView == "calendar") 
                        var select_location_link = '<a href="calendar?&loc=' + addresses[i][4] + '" class="btn btn-primary map_loc_btn" role="button">Standort auswählen</a><br/>';

                    var loc_navigate_href = 'https://www.google.de/maps/place/' + addresses[i][0] + '+' + addresses[i][1] + '+' + addresses[i][2] + '/';
                    var popup_text =    '<div class="cnw_skip_translation">' +
                                                    '<b>' + addresses[i][3] + '</b><br/>' +
                                                    addresses[i][0] + '<br/>' +
                                                    addresses[i][1] + ' ' + addresses[i][2] + '<br/>' +
                                                '</div>' +
                                                select_location_link +
                                                '<a href="' + loc_navigate_href + '" target="_blank" class="btn btn-primary map_loc_btn" role="button">Hierhin navigieren</a>';

                    var selected_text = "";
                    var selected_ratio = 0.5;
                    var possible_text = "";
                    var possible_ratio = 0.5;
                    if ( Object.keys( addresses ).length > 1 ) {
                        selected_text = i + 1;
                        selected_ratio = 0;
                        possible_text = i + 1;
                        possible_ratio = 0;
                    }

                    if ( addresses[ i ][ 5 ] == 999 || addresses[ i ][ 6 ] == 999 ) {
                        selected_text = i + 1;
                        possible_text = i + 1;
                        continue;
                    }

                    // createMarker( latlonAddresses[i][0], latlonAddresses[i][1], map_marker_colors['possible'], possible_ratio, possible_text, map_marker_colors['possible_font'] )
                    //     .addTo(map)
                    //     .addTo(markers)
                    //     .bindPopup(popup_text);

                    var tmp_marker = createMarker( latlonAddresses[ i ][ 0 ], latlonAddresses[ i ][ 1 ], map_marker_colors[ 'possible' ], possible_ratio, possible_text, map_marker_colors[ 'possible_font' ] );
                    tmp_marker
                        .addTo( map )
                        .addTo( markers )
                        .bindPopup();

                    tmp_marker.on( 'click', marker_onclick );
                    function marker_onclick() {
                        var popup = this.getPopup();
                        var chart_div = $( "#map_marker_content-" + addresses[ i ][ 4 ] ).html();
                        popup.setContent( chart_div );
                    }
                
                    var city = addresses[i][2];
                    if (typeof city !== 'undefined') {
                        var path = window.location.pathname;
                        path = path.slice(0, path.lastIndexOf("/"));
                        var cityFilePath = path + "/temp/map/";
                        let xhr = new XMLHttpRequest();
                        xhr.open('GET', cityFilePath + city + '.xml');
                        xhr.onload = function() {
                            if (xhr.status !== 200) return
                            var geojson = osm2geojson(xhr.response);
                            L.geoJSON(geojson).addTo(map);
                        };
                        xhr.send();

                        map.on('layeradd', function(){
                            $("path.leaflet-interactive").attr({
                                "stroke": "var(--primary-color)",
                                "fill": "var(--primary-color)",
                                "fill-opacity": "0.1",
                            });
                        });
                    }
            
                }

                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        createMarker(position.coords.latitude, position.coords.longitude, map_marker_colors['local'], 0.5, "" )
                            .addTo(map)
                            .addTo(markers)
                            .bindPopup( $('#local_popup_text').val() );
                        map.fitBounds(markers.getBounds(), {padding: [50, 50]});
                    },
                    function () {
            //              console.log('Die aktuelle Position konnte nicht ermittelt werden.');
                    }
                );

                if(JSON.stringify(markers.getBounds()) !== '{}')
                    map.fitBounds(markers.getBounds(), {padding: [50, 50]});

                $(".marker_local").replaceWith(createMarker( 0, 0, map_marker_colors['local'], 0.5, "", "", [12,20], 1, true ).options.icon.options.html);
                $(".marker_selected").replaceWith(createMarker( 0, 0, map_marker_colors['selected'], 0.5, "", map_marker_colors['selected_font'], [12,20], 1, true ).options.icon.options.html);
                $(".marker_possible").replaceWith(createMarker( 0, 0, map_marker_colors['possible'], 0.5, "", map_marker_colors['possible_font'], [12,20], 1, true ).options.icon.options.html);

            });

    }

    $("#loc_map").show();
    $("#map_legend").show();
    $("#map_agreement").hide();

}

//Stuff für das Einstellungsmenü //
var DisclosureNav = function (domNode) {
    this.rootNode = domNode;
    this.triggerNodes = [];
    this.controlledNodes = [];
    this.openIndex = null;
    this.useArrowKeys = true;
};

DisclosureNav.prototype.init = function () {
    var buttons = this.rootNode.querySelectorAll("button[aria-expanded][aria-controls]");
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        var menu = button.parentNode.querySelector("ul");
        if (menu) {
            // save ref to button and controlled menu
            this.triggerNodes.push(button);
            this.controlledNodes.push(menu);

            // collapse menus
            button.setAttribute("aria-expanded", "false");
            this.toggleMenu(menu, false);

            // attach event listeners
            menu.addEventListener("keydown", this.handleMenuKeyDown.bind(this));
            button.addEventListener("click", this.handleButtonClick.bind(this));
            button.addEventListener("keydown", this.handleButtonKeyDown.bind(this));
        }
    }

    this.rootNode.addEventListener("focusout", this.handleBlur.bind(this));
};

DisclosureNav.prototype.toggleMenu = function (domNode, show) {
    if (domNode) {
        domNode.style.display = show ? "block" : "none";
    }
};

DisclosureNav.prototype.toggleExpand = function (index, expanded) {
    // close open menu, if applicable
    if (this.openIndex !== index) {
        this.toggleExpand(this.openIndex, false);
    }

    // handle menu at called index
    if (this.triggerNodes[index]) {
        this.openIndex = expanded ? index : null;
        this.triggerNodes[index].setAttribute("aria-expanded", expanded);
        this.toggleMenu(this.controlledNodes[index], expanded);
    }
};

DisclosureNav.prototype.controlFocusByKey = function (keyboardEvent, nodeList, currentIndex) {
    switch (keyboardEvent.key) {
        case "ArrowUp":
        case "ArrowLeft":
            keyboardEvent.preventDefault();
            if (currentIndex > -1) {
                var prevIndex = Math.max(0, currentIndex - 1);
                nodeList[prevIndex].focus();
            }
            break;
        case "ArrowDown":
        case "ArrowRight":
            keyboardEvent.preventDefault();
            if (currentIndex > -1) {
                var nextIndex = Math.min(nodeList.length - 1, currentIndex + 1);
                nodeList[nextIndex].focus();
            }
            break;
        case "Home":
            keyboardEvent.preventDefault();
            nodeList[0].focus();
            break;
        case "End":
            keyboardEvent.preventDefault();
            nodeList[nodeList.length - 1].focus();
            break;
    }
};

/* Event Handlers */
DisclosureNav.prototype.handleBlur = function (event) {
    var menuContainsFocus = this.rootNode.contains(event.relatedTarget);
    if (!menuContainsFocus && this.openIndex !== null) {
        this.toggleExpand(this.openIndex, false);
    }
};

DisclosureNav.prototype.handleButtonKeyDown = function (event) {
    var targetButtonIndex = this.triggerNodes.indexOf(document.activeElement);

    // close on escape
    if (event.key === "Escape") {
        this.toggleExpand(this.openIndex, false);
    }

    // move focus into the open menu if the current menu is open
    else if (this.useArrowKeys && this.openIndex === targetButtonIndex && event.key === "ArrowDown") {
        event.preventDefault();
        this.controlledNodes[this.openIndex].querySelector("a").focus();
    }

    // handle arrow key navigation between top-level buttons, if set
    else if (this.useArrowKeys) {
        this.controlFocusByKey(event, this.triggerNodes, targetButtonIndex);
    }
};

DisclosureNav.prototype.handleButtonClick = function (event) {
    var button = event.target;
    if(event.target.outerHTML.indexOf("button")<0){
        button = event.target.parentElement;
    }
    var buttonIndex = this.triggerNodes.indexOf(button);

    var buttonExpanded = button.getAttribute("aria-expanded") === "true";

    this.toggleExpand(buttonIndex, !buttonExpanded);
};

DisclosureNav.prototype.handleMenuKeyDown = function (event) {
    if (this.openIndex === null) {
        return;
    }

    var menuLinks = Array.prototype.slice.call(this.controlledNodes[this.openIndex].querySelectorAll("a"));
    var currentIndex = menuLinks.indexOf(document.activeElement);

    // close on escape
    if (event.key === "Escape") {
        this.triggerNodes[this.openIndex].focus();
        this.toggleExpand(this.openIndex, false);
    }

    // handle arrow key navigation within menu links, if set
    else if (this.useArrowKeys) {
        this.controlFocusByKey(event, menuLinks, currentIndex);
    }
};

// switch on/off arrow key navigation
DisclosureNav.prototype.updateKeyControls = function (useArrowKeys) {
    this.useArrowKeys = useArrowKeys;
};

/* Initialize Disclosure Menus */

    window.addEventListener("load", function (event) {
    var menus = document.querySelectorAll(".disclosure-nav");
    var disclosureMenus = [];

        for (var i = 0; i < menus.length; i++) {
            disclosureMenus[i] = new DisclosureNav(menus[i]);
            disclosureMenus[i].init();
        }

        // listen to arrow key checkbox
        var arrowKeySwitch = document.getElementById("arrow-behavior-switch");
        if(arrowKeySwitch){
            arrowKeySwitch.addEventListener("change", function (event) {
                var checked = arrowKeySwitch.checked;
                for (var i = 0; i < disclosureMenus.length; i++) {
                    disclosureMenus[i].updateKeyControls(checked);
                }
            });
        }

        $("#id_lang_menu").on("keyup", function(e) {
            if (e.key === "Enter") {
                $("#id_lang_menu").hide();
            }
        });
    }, false);

// Luftlinien-Berechnung
function calculateDistances( position ) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    $( '.suggest_location_panel' ).each( function () {
        let loc_lat = $( this ).find( 'input[type="hidden"][name="gps_lat"]' ).val();
        let loc_long = $( this ).find( 'input[type="hidden"][name="gps_long"]' ).val();

        let distance = PythagorasEquirectangular( lat, long, parseFloat( loc_lat ), parseFloat( loc_long ) );
        console.log( 'distance: ' + distance );
        if ( distance > 0 ) {
            $( this ).find( 'dd.sugg_loc_distance' ).text( "ca. " + distance + " km" );
            //let ariatext = $( this ).text().trim() + "Entfernung Luftlinie etwa "+ distance + " Kilometer";
        }
    } );
}

function toRad( deg ) {
    let degree = deg * Math.PI / 180;
    return degree;
}

function PythagorasEquirectangular( lat1, lon1, lat2, lon2 ) {
    if( lat2 == 999 || lon2 == 999 )
        return 0;

    var dLat = toRad( lat2 - lat1 );
    var dLon = toRad( lon2 - lon1 );
    var lat1 = toRad( lat1 );
    var lat2 = toRad( lat2 );
    var R = 6371; // km
    var a = Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) + Math.sin( dLon / 2 ) * Math.sin( dLon / 2 ) * Math.cos( lat1 ) * Math.cos( lat2 );
    var c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );
    var d = R * c;
    return d.toFixed( 1 );
}

function toggle_password(){
    $( "input.type_password" ).each( function () {
        if ( $( this ).attr( 'type' ) === 'password' )
            $( this ).attr( 'type', 'text' );
        else
            $( this ).attr( 'type', 'password' );
    } );
}

function conword_translate(lang){
    let cookie_path = window.location.pathname;
    cookie_path = cookie_path.slice( 0, cookie_path.lastIndexOf( "/" ) );
    let cookie_domain = window.location.host;

    if( getCookie("language") === "de_VS" ){
        setCookie( "language", "de_DE", {
            path: cookie_path,
            domain: cookie_domain,
            secure: true,
            samesite: 'None'
        } );

        Conword.translate(lang);
        location.reload();
    } else if ( getCookie("language") === "de_DE" ) {
        Conword.translate(lang);
    }

}
