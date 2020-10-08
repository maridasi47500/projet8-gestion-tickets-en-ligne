$(function(){
    
$('#lister-responsables').submit(function(){
    var nomresponsable = $("#nom-responsable").val();
    var type=$(this).attr("method");
    var path=$(this).attr("action");
    $.ajax({
        url:path+"?"+$(this).serialize(),
        type:type,
        success:function(res){
            if (typeof res !== "string") {
            $('.liste-tickets').html("<h1>Tickets de "+nomresponsable+"</h1>");
            console.log(res);
            res.forEach(function(ticket){
                $('.liste-tickets').append(`
<p>${ticket.title} - ${ticket.completed ? "Traité" : "Non traité"} - <a href="/ticket/${ticket._id}">Voir</a></p>`);
            });
            } else {
            $('.liste-tickets').html("<p>"+res+"</p>");
            } 
        }
    });
});
});
