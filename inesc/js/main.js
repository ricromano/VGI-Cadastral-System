var map;

function init() {
  
  
  //Clean Input fields
  //cleanInputs();
  
  // Create a map
  map = new ol.Map({
    target: 'main_map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      zoom: 2,
      center: [0, 0]
    })
  }); 
  
  // Show divs Home
  goToStep(1);
  
  // Update main_button_searchAddress state
  disable("main_button_searchAddress", true);
  
  // Update main_button_selectAction state
  actionChanged($("#main_select_action").val());
     
  // Load case information (description and image)
  getCaseInfo($("#main_select_case").val());
  
}


/**
 * Go to one specific step. 
 * Options:
 *   0 - home,
 *   1 - search,
 *   2 - action selection,
 *   3 - case selection.
 */
function goToStep(val){
  switch(val){
    case 0:
      //document.getElementById('main_home').style.display = 'none';
      //document.getElementById('main_moreInfo').style.display = 'none';
      document.getElementById('main_search').style.display = 'none';   
      document.getElementById('main_caseSelection').style.display = 'none'; 
      break;
    case 1:
      document.getElementById('main_search').style.display = 'block';   
      document.getElementById('main_map').style.display = 'none';
      document.getElementById('main_actionSelection').style.display = 'none';
      document.getElementById('main_caseSelection').style.display = 'none';     
      break;
    case 2:
      document.getElementById('main_search').style.display = 'block';
      document.getElementById('main_map').style.display = 'block';
      document.getElementById('main_actionSelection').style.display = 'block';
      document.getElementById('main_caseSelection').style.display = 'none';  
      break;
    case 3:
      document.getElementById('main_search').style.display = 'none';   
      document.getElementById('main_caseSelection').style.display = 'block';     
      break;        
  }   
}


/**
 * Updates the main_button_searchAddress state.
 */
function searchTextLenth(val){ 
    if(val.length > 0) {
         // Enable button
         disable("main_button_searchAddress", false);
    } else {
         // Disable button
         disable("main_button_searchAddress", true);
    }
}


/**
 * Search an address and center the map in the location. 
 */
function searchAddress(){
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
	  var addresses = JSON.parse(this.responseText);
	  var searchOutputText = document.getElementById('main_searchOutputText');
	  document.getElementById('main_searchBar').style.height = '110px';
	  if (addresses.length > 0){
	    searchOutputText.innerHTML = "<b>"+ addresses[0].display_name +"</b>";
	    //document.getElementById('main_searchOutputCoordinates').innerHTML = addresses[0].geojson.coordinates;
	    var lat = Number(addresses[0].lat);
      var lon = Number(addresses[0].lon);

      // Center the map
      CenterMap(lon, lat);
      // Show the map and action selection
      goToStep(2);
    }
    else{
    searchOutputText.innerHTML = "A pesquisa por <b>" + main_searchText.value + "</b> não devolveu nenhum resultado.\nPor favor redefina o texto.";
    }
  };
  //xhr.open("get", 'http://nominatim.openstreetmap.org/search?q='+main_searchText.value+'&format=JSON&addressdetails=1', true);
  xhr.open("get", 'http://nominatim.openstreetmap.org/search/'+main_searchText.value+'?format=jsonv2&addressdetails=1&limit=1&polygon_geojson=1', true);

  xhr.send();
}


/**
 * Center the map based on coordinates.
 */
function CenterMap(long, lat) {
    //console.log("Long: " + long + " Lat: " + lat);
    map.getView().setCenter(ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'));
    map.getView().setZoom(14);
}


/**
 * Updates the main_button_selectAction state.
 */
function actionChanged(sel) {
  if(sel === "add"){
    disable("main_button_selectAction", true);
  }
  else{
    disable("main_button_selectAction", false);
  }
}


/**
 * Enable or disable an element.
 */
function disable(i, val){
    $("#"+i).prop("disabled",val);
}


/**
 * Select the action (edit or remove).
 */
function selectAction(){
  var action = $("#main_select_action").val(); 
  if(action === 'edit'){
    goToStep(3);   
  }
  else if(action === 'remove'){
    if(confirm('Está prestes a remover o Caso selecionado.\nTem a certeza que pretende continuar?')){
      alert('Remove from DB!'); //TODO
      }
  }   
}


/**
 * Read one specific case description.
 */
function getCaseInfo(sel) {
  
  $(document).ready(function()
  {
    $.get('cases.xml', function(d){

      $(d).find('case').each(function(){

          var $cases = $(this); 
          var title = $cases.attr("title");
          if (title === sel){
            var description = $cases.find('description').text();
            var imageurl = $cases.attr('imageurl');
            document.getElementById("main_caseDescription").innerHTML = description;
            document.getElementById("main_caseImg").src = imageurl;
            document.getElementById("main_caseImg").alt = sel;
          }
      });
    });
  });
}


/**
 * Save the Case information to DB.
 */
function saveCase(){
  //TODO - Save to DB
  alert("Save to DB!");
  goToStep(2);    
}


/**
 * Keyboard interaction.
 */
$(function(){
  $("#main_searchText").keyup(function (e) {
  if (e.which == 13 && !$("#main_button_searchAddress").is(':disabled')) {
    $("#main_button_searchAddress").trigger('click');
    return false;
  }
  });
});


/**
 * Clean input fields.
 */
 /*
function cleanInputs() {
  $(':input')
   .not(':button, :submit, :reset, :hidden')
   .val('')
   .removeAttr('checked')
   .removeAttr('selected');
}
*/
