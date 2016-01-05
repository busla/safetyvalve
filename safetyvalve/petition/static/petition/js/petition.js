
$(function () {
    var csrftoken = Cookies.get('csrftoken');
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    /**
     * POST signature
     */

    function postSignature(url, container) {      
       
        $.ajax({
            type: 'POST',
            url: url,            
            success: function(data) {
              console.log(data);   
              //console.log(container); 
              
              container.after(data);
              container.remove()
              //container.load(json);
              //container.replaceWith(json);
            },
            error : function(xhr,errmsg,err) {
                console.log(xhr, errmsg, err)                
                //console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }          
        });      
    }

    /**
     * Use CSRF cookie in all POST requests.     
     */

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    /**
     * Unsign petition
     */

    $('body').on('click', 'div.unsign .addremove_signature', function (e) {
        e.preventDefault();
        var msg = $('#msg_sure').text();
        if (confirm(msg)) {
            container = $(this).parent();

            petition_id = container.data('id');

            url = '/frumvarp/' + petition_id + '/afsafna/';
            postSignature(url, container);            
        }

      
    });
    
    /**
     * Should signature be public?
     */    

    $('body').on('click', '.pre_selection_container .addremove_signature', function(e) {
        e.preventDefault();
        container = $(this).parent().parent();

        stance = '';
        if ($(this).hasClass('endorse')) {
            stance = 'endorse';
        }
        else if ($(this).hasClass('oppose')) {
            stance = 'oppose';
        }

        container.find('.stance').val(stance)

        container.find('.pre_selection_container').hide();
        container.find('.post_selection_container').show();

    });
    
    /**
     * Make signature public and POST
     */

    $('body').on('click', '.post_selection_container .addremove_signature', function(e) {
        e.preventDefault();
        container = $(this).parent().parent();

        show_public = container.find('.show_public').is(':checked');
        stance = container.find('.stance').val();

        petition_id = container.data('id');        

        url = '/frumvarp/' + petition_id + '/safna/' + stance + '/?show_public=' + (show_public ? '1' : '0');
        postSignature(url, container);

        //url = '/frumvarp/' + petition_id + '/skra/' + stance + '/?show_public=' + (show_public ? '1' : '0');

        //location.href = url;

        
        
    });

    /**
     * Cancel voting
     */

    $('body').on('click', '.post_selection_container .signature_cancel', function(e) {
        container = $(this).parent().parent();

        container.find('.post_selection_container').hide();
        container.find('.pre_selection_container').show();

        e.preventDefault();
        return false;
    });

    $('.fb_share').sharrre({
        share: {
            facebook: true
        },
        template: '<div class="icon share_icon"><i class="fa fa-facebook-square"></i><span class="detail_figure">{total}</span></div>',
        enableHover: false,
        enableTracking: false,
        click: function(api, options) {
            api.simulateClick();
            api.openPopup('facebook');
        }
    });

    $('.twitter_share').sharrre({
        share: {
            twitter: true
        },
        template: '<div class="icon share_icon"><i class="fa fa-twitter-square"></i><span class="detail_figure">{total}</span></div>',
        enableHover: false,
        enableTracking: false,
        click: function(api, options) {
            api.simulateClick();
            api.openPopup('twitter');
        }
    });

});

