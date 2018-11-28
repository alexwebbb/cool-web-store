$(document).ready(function() {
    $("#js-search-input").keyup(function() {
      var normalizedInput = $("#js-search-input")
        .val()
        .toUpperCase();
  
      $.map($("#js-search-container .js-search-element"), element => {
        if (
          $(element)
            .attr("data-label")
            .toUpperCase()
            .indexOf(normalizedInput) > -1
        ) {
          $(element).toggle(true);
        } else {
          $(element).toggle(false);
        }
      });
    });
  });
  