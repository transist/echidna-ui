$( document ).ready(function() {
  

    
    // simulate keywords
    var keywordItem = '<li><a href="" class="keyword label label-info">keyword</a><a href="" class="delete"><i class="icon-remove"></i></a></li>';
    

    //sort chosen items per colum,
    var itemsPerColumns = 20;

    for (var i = 0; i < 50; i++) {

        // var i = $("#final-list ul li").length;
        if(  i < itemsPerColumns ) $("#final-list ul .col1").append(keywordItem);
        else if( i > itemsPerColumns && i < itemsPerColumns*2 ) $("#final-list ul .col2").append(keywordItem);

        else if( i > itemsPerColumns*2 ) $("#final-list ul .col3").append(keywordItem);
    };


});