(function(Hiof, undefined) {

    // Functions


    itservicesAppendData = function(data, settings) {
        //var data = semesterStartLoadData(options);
        //debug('From itservicesAppendData:');
        //debug(data);
        //debug(settings);
        data.meta = settings;
        data.meta.type = 'itservices';
        data.meta.readmore = Hiof.options.i18n.nb.itservices.readmore;

        if (settings.audience === 'employee') {
            data.meta.title = Hiof.options.i18n.nb.itservices.titleeployee;
        } else {
            data.meta.title = Hiof.options.i18n.nb.itservices.titlestudents;
        }


        //debug(data);
        var templateSource, markup;

        if (settings.template === 'single') {
            data.meta.pagetitle = data.page['0'].pagetitle;
            data.meta.support = [{
                "url": 'http://www2.hiof.no/nor/it_drift/studenthjelp#/it-tjenester/23547',
                "name": 'FAQ'
            },{
                "url": 'mailto:itvakt@hiof.no',
                "name": 'IT-vakt epost'
            }];
            templateSourceBreadcrumb = Hiof.Templates['itservices/breadcrumbs'];
            templateSource = Hiof.Templates['page/show'];
            templateSourceSupport = Hiof.Templates['itservices/support'];
            markup = templateSourceBreadcrumb(data) + templateSource(data) + templateSourceSupport(data);
        } else {
            templateSource = Hiof.Templates['itservices/list'];

            markup = templateSource(data);
        }


        $('#itservices').html(markup);
        var scrollDestEl = "#content";
        Hiof.scrollToElement(scrollDestEl);
    };


    itservicesLoadData = function(options) {

        var audience = $('#itservices').attr('data-audience');
        if (typeof audience === 'undefined') {
            audience = 'student';
        }


        // Setup the query
        var settings = $.extend({
            id: null,
            template: "list",
            view: 'short',
            url: 'http://hiof.no/api/v1/itservices/',
            audience: audience
        }, options);
        //debug(settings);


        var contentType = "application/x-www-form-urlencoded; charset=utf-8";
        if (window.XDomainRequest) { //for IE8,IE9
            contentType = "text/plain";
        }
        $.ajax({
            url: settings.url,
            method: 'GET',
            async: true,
            dataType: 'json',
            data: settings,
            contentType: contentType,
            success: function(data) {
                //alert("Data from Server: "+JSON.stringify(data));
                //debug('Settings from success');
                //debug(settings);
                //debug('Data from success');
                //debug(data);
                //return data;
                itservicesAppendData(data, settings);
                //Hiof.articleDisplayView(data, settings);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //alert("You can not send Cross Domain AJAX requests: " + errorThrown);
            }

        });


    };

    // Routing
    Path.map("#/it-tjenester/:pageid").enter(function() {
        //Reset checkboxes
        //resetFilter();
    }).to(function() {
        var options = {};
        options.id = this.params.pageid;
        options.template = 'single';
        itservicesLoadData(options);
    });
    Path.map("#/it-tjenester").to(function() {
        itservicesLoadData();
    });
    Path.map("#/it-tjenester/").to(function() {
        itservicesLoadData();
    });

    initatePathItservices = function() {
        // Load root path if no path is active
        Path.root("#/it-tjenester");
    };


    // Run functions on load
    $(function() {
      if (!$('#semesterstart').length) {
        if ($('#itservices').length) {
            initatePathItservices();
            Path.listen();
        }
      }
    });
    // Expose functions to the window

})(window.Hiof = window.Hiof || {});
