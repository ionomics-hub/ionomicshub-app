/*global _*/
/*jshint camelcase: false*/
(function(window, $, _, undefined) {
  'use strict';

  console.log('Hello, Ionomics Hub!');

  var appContext = $('[data-app-name="ionomicshub-app"]');

  /* Wait for Agave to Bootstrap before executing our code. */
  window.addEventListener('Agave::ready', function() {
    var Agave = window.Agave;

    var templates = {
	  atgnumresultTable: _.template('<h4> Growth tray information containing a plant sample of the desired ATG number </h4><table class="table"><thead><tr><th>Workspace</th><th>Tray</th><th>Temperature</th><th>Day Length</th></tr></thead><tbody><% _.each(data, function(r) { %><tr><td><%= r.Workspace %></td><td><%= r.Tray %></td><td><%= r.Temperature %></td><td><%= r["Day Length"] %></td></tr><% }) %></tbody></table>'),
	  resultTable: _.template('<h4> Detailed individual plant information of the desired ATG number </h4><table class="table"><thead><tr><th>Tray</th><th>Tube</th><th>Line</th><th>Tissue</th><th>ATG Number(s)</th><th>Plant Type</th><th>Structure</th><th>Parent</th><th>Li7</th><th>B11</th><th>Na23</th><th>Mg25</th><th>Al27</th><th>P31</th><th>S34</th><th>Cl35</th><th>K39</th><th>Ca43</th><th>Ca44</th><th>SO48</th><th>Cr52</th><th>Mn55</th><th>Fe56</th><th>Fe57</th><th>Co59</th><th>Ni60</th><th>Cu65</th><th>Zn66</th><th>Ga71</th><th>As75</th><th>Se77</th><th>Se80</th><th>Se82</th><th>Rb85</th><th>Sr88</th><th>Mo95</th><th>Mo98</th><th>Cd111</th><th>In113</th><th>Cd114</th><th>In115</th><th>Pb208</th></tr></thead><tbody><% _.each(data, function(r) { %><tr><td><%= r.Tray %></td><td><%= r.Tube %></td><td><%= r.Line %></td><td><%= r.Tissue %></td><td><%= r["ATG Number(s)"] %></td><td><%= r["Plant Type"] %></td><td><%= r.Structure %></td><td><%= r.Parent %></td><td><%= r[values_type].Li7 %></td><td><%= r[values_type].B11 %></td><td><%= r[values_type].Na23 %></td><td><%= r[values_type].Mg25 %></td><td><%= r[values_type].Al27 %></td><td><%= r[values_type].P31 %></td><td><%= r[values_type].S34 %></td><td><%= r[values_type].Cl35 %></td><td><%= r[values_type].K39 %></td><td><%= r[values_type].Ca43 %></td><td><%= r[values_type].Ca44 %></td><td><%= r[values_type].SO48 %></td><td><%= r[values_type].Cr52 %></td><td><%= r[values_type].Mn55 %></td><td><%= r[values_type].Fe56 %></td><td><%= r[values_type].Fe57 %></td><td><%= r[values_type].Co59 %></td><td><%= r[values_type].Ni60 %></td><td><%= r[values_type].Cu65 %></td><td><%= r[values_type].Zn66 %></td><td><%= r[values_type].Ga71 %></td><td><%= r[values_type].As75 %></td><td><%= r[values_type].Se77 %></td><td><%= r[values_type].Se80 %></td><td><%= r[values_type].Se82 %></td><td><%= r[values_type].Rb85 %></td><td><%= r[values_type].Sr88 %></td><td><%= r[values_type].Mo95 %></td><td><%= r[values_type].Mo98 %></td><td><%= r[values_type].Cd111 %></td><td><%= r[values_type].In113 %></td><td><%= r[values_type].Cd114 %></td><td><%= r[values_type].In115 %></td><td><%= r[values_type].Pb208 %></td></tr><% }) %></tbody></table>')      
    };

    var showResults = function( json ) {
		
		$('#progress_region', appContext).addClass('hidden');
		$( '#allresults', appContext ).show();
		$( '#results', appContext ).show();
      // show error message for invalid object
      if ( ! ( json && json.obj ) ) {
        $( '.results', appContext ).html( '<div class="alert alert-danger">No data or invalid response!</div>' );
        return;
      }
	var data = json.obj || json;
	if(data.length == 1&& data[0] == "No corresponding ATG Number found"){
		 $( '.results', appContext ).html( '<div class="alert alert-danger">No data or invalid response!</div>' );
        return;
	}
	//console.log('data received!');
	//console.log(JSON.stringify(data));
	var traydata = [];
	//console.log(data.length);
	var prevTray = 0;
	var trayCount = 0;
	//var tubeCount = 0;
	for(var i = 0 ; i < data.length; i++){
			var tube = data[i];
			//tubeCount++;
			if(prevTray != tube["Tray"]){ // New tray
				var tray = {
					"Workspace" : tube["Workspace"],
					"Tray" : tube["Tray"],
					"Temperature" : tube["Tray Conditions"]["Temperature"],
					"Day Length" : tube["Tray Conditions"]["Day Length"]
					//"No. of Tubes" : tubeCount
				};
				traydata[trayCount] = tray;
				trayCount++;
				prevTray = tube["Tray"];
				//tubeCount = 0;
			}
	}
	document.getElementById("wt_traycount").value = trayCount;
	//console.log(traydata);
	var mytraydata = {
		"data": traydata
	};
	var mydata = {"data": data,
		"values_type": document.getElementById("_wtvalues_type").value
	};
	  
	  $( '.atgnumresults', appContext ).html( templates.atgnumresultTable(mytraydata));	
	  $( '.prevnextbuttons', appContext ).html( '<button name="prev" id="prev" class="btn btn-primary" >Prev</button> <button name="next" id="next" class="btn btn-primary">Next</button>');
	  $( '.results', appContext ).html( templates.resultTable(mydata));

	var curskip = Number(document.getElementById("wt_skip").value);
	var curlimit = Number(document.getElementById("wt_limit").value);
	if(curskip=='0'){
		document.getElementById("prev").setAttribute("disabled","disabled");
	}else{
		document.getElementById("prev").removeAttribute("disabled");
	}
	//console.log('trayCount: '+ trayCount);
	if(trayCount < curlimit){
		document.getElementById("next").setAttribute("disabled","disabled");
	}else{
		document.getElementById("next").removeAttribute("disabled");
	}
	
		$( 'button[name=prev]', appContext ).on('click', function( e ) {
			e.preventDefault();
			$('#progress_region', appContext).removeClass('hidden');
			$( '#results', appContext ).hide();
			var atgnum = document.getElementById("wt_atgnum").value;
			var skip = Number(document.getElementById("wt_skip").value);
			var limit = Number(document.getElementById("wt_limit").value);
			skip -= limit;
			if(skip < 0){
				skip = 0;
			}
			//console.log('New skip: '+ skip);
			document.getElementById("wt_skip").value = skip;
			var query = {
			  ATGNum: atgnum,
			  Skip: skip,
			  Limit: limit
			};
			Agave.api.adama.getAccess(
			  {namespace: 'ionomicshub', service: 'atg_number_search_v0.1', queryParams: query},
			  showResults);
		});	
	
		$( 'button[name=next]', appContext ).on('click', function( e ) {
			e.preventDefault();
			$('#progress_region', appContext).removeClass('hidden');
			$( '#results', appContext ).hide();
			var atgnum = document.getElementById("wt_atgnum").value;
			var skip = Number(document.getElementById("wt_skip").value);
			var limit = Number(document.getElementById("wt_limit").value);
			skip += limit;
			//console.log('New skip: '+ skip);
			document.getElementById("wt_skip").value = skip;
			// Add condition here!
			var query = {
			  ATGNum: atgnum,
			  Skip: skip,
			  Limit: limit
			};
			Agave.api.adama.getAccess(
			  {namespace: 'ionomicshub', service: 'atg_number_search_v0.1', queryParams: query},
			  showResults);
		});
		
	
	  //$( '.atgnumresults table', appContext ).dataTable();
        $( '.results table', appContext ).dataTable({
        "scrollX": true
    });
    };

	  
    $( 'form', appContext ).on('submit', function(e) {
      e.preventDefault();
	  // start progress bar and tab spinners
	  $('#progress_region', appContext).removeClass('hidden');
	  $( '#allresults', appContext ).hide();
      // showResults( $(this).serializeArray() );

      // STEP 2.1
      // showResults( this.locus.value );

      // STEP 2.2
	  var query = {
		  ATGNum: this.atgnum.value,
		  Skip: this.skip.value,
		  Limit: this.limit.value
	  };
	  Agave.api.adama.getAccess(
		{namespace: 'ionomicshub', service: 'atg_number_search_v0.1', queryParams: query},
		showResults);
    });

  });

})(window, jQuery, _);