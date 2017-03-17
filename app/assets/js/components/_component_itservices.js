class ItservicesView {
  constructor() {
    this.view = new View();

    this.templateBreadcrumb = Hiof.Templates['itservices/breadcrumbs'];
    this.templatePageShow = Hiof.Templates['page/show'];
    this.templateSourceSupport = Hiof.Templates['itservices/support'];
    this.templateItservicesList = Hiof.Templates['itservices/list'];

    this.audience = $('#itservices').attr('data-audience');
    if (typeof this.audience === 'undefined') {
      this.audience = 'student';
    };
    this.defaults = {
      id: null,
      template: "list",
      view: 'short',
      url: '//www.hiof.no/api/v1/itservices/',
      audience: this.audience
    };
  };
  renderItservices(options ={}){
    let that = this;

    let settings = Object.assign(
      {},
      this.defaults,
      options
    );

    this.view.getData(settings, that).success(function(data){

      let templateSource, markup;
      data.meta = settings;
      data.meta.type = 'itservices';



      // var lang = Hiof.options.language.toString();
      // var i18n = Hiof.options.i18n;

      //if (lang == 'en') {
      //  //debug("lang is english");
      //  data.meta.readmore = i18n.en.itservices.readmore;
      //  if (settings.audience === 'employee') {
      //    data.meta.title = i18n.en.itservices.titleeployee;
      //  } else {
      //    data.meta.title = i18n.en.itservices.titlestudents;
      //  }
      //} else {
      //  //debug("lang is norwegian");
      //  data.meta.readmore = i18n.nb.itservices.readmore;
      //  if (settings.audience === 'employee') {
      //    data.meta.title = i18n.nb.itservices.titleeployee;
      //  } else {
      //    data.meta.title = i18n.nb.itservices.titlestudents;
      //  }
      //}

      if (settings.template === 'single') {

        data.meta.pagetitle = data.page['0'].pagetitle;
        if (settings.audience === 'employee') {
          data.meta.support = [{
            "url": 'http://www2.hiof.no/nor/it_drift/ansatthjelp#/it-tjenester/24408',
            "name": 'FAQ'
          }, {
            "url": 'mailto:itvakt@hiof.no',
            "name": 'Epost'
          }];
        } else {
          data.meta.support = [{
            "url": 'http://www2.hiof.no/nor/it_drift/studenthjelp#/it-tjenester/23547',
            "name": 'FAQ'
          }, {
            "url": 'mailto:itvakt@hiof.no',
            "name": 'Epost'
          }];
        }
        markup = that.templateBreadcrumb(data) + that.templatePageShow(data) + that.templateSourceSupport(data) + that.templateBreadcrumb(data);
      } else {
        markup = that.templateItservicesList(data);
      }
      $('#itservices').html(markup);
      var scrollDestEl = "#content";
      Hiof.scrollToElement(scrollDestEl);
    });
  };
}
(function(Hiof, undefined) {
  $(function(){
    let itservicesView = new ItservicesView();

    Path.map("#/it-tjenester/:pageid").enter(function() {
      //Reset checkboxes
      //resetFilter();
    }).to(function() {
      var options = {};
      options.id = this.params.pageid;
      options.template = 'single';
      itservicesView.renderItservices(options);
    });
    Path.map("#/it-tjenester").to(function() {
      itservicesView.renderItservices();
    });
    Path.map("#/it-tjenester/").to(function() {
      itservicesView.renderItservices();
    });

    initatePathItservices = function() {
      // Load root path if no path is active
      Path.root("#/it-tjenester");
    };

    if (!$('#semesterstart').length) {
      if ($('#itservices').length) {
        initatePathItservices();
        Path.listen();
      }
    }
    $(document).on('click', '#itservices a', function(e) {
      //e.preventDefault();
      var url = $(this).attr('href');
      if (url.substring(0, 2) == "#/") {
        //debug('String starts with #/');
      } else if (url.substring(0, 1) == "#") {
        hash = url + "";
        e.preventDefault();
        setTimeout(function() {
          Hiof.scrollToElement(hash);
        }, 200);

      }
    });


  });
})(window.Hiof = window.Hiof || {});
