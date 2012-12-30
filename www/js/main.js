var AppRouter = Backbone.Router.extend({

	routes: {
	    ""                : "home",
	    "about"           : "about",
	    "graph"           : "graph",
	    "rax"             : "rax",
	},

	initialize: function () {
	    document.addEventListener('deviceready', function() {
		    window.utils.showAlert("Device", "Detected", "alert-success");
		});
	    
	    this.navbarView = new NavigationView({ templateSelector: '#navbarview',
						   targetSelector: '#navbar' });
	    this.navbarView.render();

	    this.sidebarView = new NavigationView({ templateSelector: '#sidebarview',
						    targetSelector: '#sidebar' });
	    this.sidebarView.render();
	},
    
	home: function () {
	    if (!this.homeView) {
		this.homeView = new ContentView({ templateSelector: '#homeview',
						  targetSelector: '#content' });
	    }
	    this.homeView.render();
	    this.navbarView.selectMenuItem('home');
	    this.sidebarView.selectMenuItem('home');
	},
    
	about: function () {
	    if (!this.aboutView) {
		this.aboutView = new ContentView({ templateSelector: '#aboutview',
						   targetSelector: '#content' });
	    }
	    this.aboutView.render();
	    this.navbarView.selectMenuItem('about');
	    this.sidebarView.selectMenuItem('about');
	},

	graph: function () {
	    if (!this.graphView) {
		this.graphView = new ContentView({ templateSelector: '#graphview',
						   targetSelector: '#content' });
	    }
	    this.graphView.render();
	    this.navbarView.selectMenuItem('graph');
	    this.sidebarView.selectMenuItem('graph');
	},
	
	rax: function () {
	    if (!this.raxView) {
		this.raxView = new ContentView({ templateSelector: '#raxview',
						 targetSelector: '#content' });
	    }
	    this.raxView.render();
	    this.navbarView.selectMenuItem('rax');
	    this.sidebarView.selectMenuItem('rax');
	    registerRaxHandlers();
	},

    });

{ // Start the main program after loading some templates
    $('#templates').load('js/templates.html',
			 function() {
			     app = new AppRouter();
			     Backbone.history.start();
			 });
};


/**
 * Rewrite a URL to redirect to proxies for cross domains
 * - http(s)://server/path/to/file
 *     If browser, rewrite to /server/host to use proxy
 *     If phonegap app, do not rewrite
 * - /path/to/file or path/to/file
 *     Do not rewrite
 */  
function proxyifyUrl(url) {
    if (window.device) { // then we are on phonegap as an app
	return url;
    }

    var regex = '^(https?:\/\/)(.*)$';
    var matches = url.match(regex);
    if (matches == null) { // then this is definitely a local file
	return url;
    }
    else {
	return '/'+matches[2]; // redirect to the proxy
    }
};


/**
 * Event Handlers
 */
function registerRaxHandlers () {
    var rax = null;

    // Load the settings if they have been previously saved
    if (localStorage.getItem('raxsave')=="true") {
	if ($('#raxuser').val() == "" && localStorage.getItem('raxuser')!=null) {
	    $('#raxuser').val(localStorage.getItem('raxuser'));
	}
	if ($('#raxpass').val() == "" && localStorage.getItem('raxpass')!=null) {
	    $('#raxpass').val(localStorage.getItem('raxpass'));
	}
	$('#raxsave').attr('checked', true);
    }
    
    $('#raxlogin').click(function(e) {
	    // read the settings
	    var username = $('#raxuser').val();
	    var password = $('#raxpass').val();
	    var raxsave  = $('#raxsave').is(":checked");

	    if (raxsave == false) {
		// clear the settings
		localStorage.setItem('raxuser', "");
		localStorage.setItem('raxpass', "");
		localStorage.setItem('raxsave', "false");
	    }

	    rax = new Rax(username, password, { urlRewriteFunc: proxyifyUrl });
	    rax.authenticate({ 
		    doneCallback: function(data) {
			if (raxsave == true) {
			    // save the settings
			    localStorage.setItem('raxuser', username);
			    localStorage.setItem('raxpass', password);
			    localStorage.setItem('raxsave', "true");
			}			
			$('#signin_row').hide();
			$('#metric_row').show();
			window.utils.showAlert("Auth Successful", sprintf("Auth Successful token[%s] tenantid[%s]", rax.token, rax.tenantid), "alert-success");
		    },
			failCallback: function(data) {
			    // clear the display
			    $('#raxuser').val("");
			    $('#raxpass').val("");
			    $('#raxsave').attr('checked', false);
			window.utils.showAlert("Auth Fail", sprintf("Auth Failed for username[%s] password[%s]", rax.username, rax.password), "alert-error");
		    }
		})
		.then(function(){
			var entityList = new EntityList( { rax: rax });
			entityList.fetchRecursive({ beforeSend: rax.setHeader })
			    .then(function() {
				    var metricSelectView = new MetricSelectView( { entityList: entityList });
				    $('#metricList').html(metricSelectView.render().innerHTML);
				});
		    });
	});
	
    $('#metricList').change(function(e) {
	    var o = e.target.options[e.target.selectedIndex];
	    rax.graphMetric('#graph',
			    o.getAttribute('entityid'),
			    o.getAttribute('checkid'),
			    o.getAttribute('metricid')
			    );
	});
};
