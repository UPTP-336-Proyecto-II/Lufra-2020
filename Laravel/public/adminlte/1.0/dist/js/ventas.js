	
	$(function() {
		
		load(1);
	});
	function load(page){
		var query=$("#q").val();
		var per_page=$("#per_page").val();
		var customer_id=$("#customer_id").val();
		var parametros = {"action":"ajax","page":page,'query':query,'per_page':per_page, 'customer_id':customer_id};
		$("#loader").fadeIn('slow');
		$.ajax({
			url:'./ajax/ventas_ajax.php',
			data: parametros,
			 beforeSend: function(objeto){
			$("#loader").html("<img src='./img/ajax-loader.gif'>");
		  },
			success:function(data){
				$(".outer_div").html(data).fadeIn('slow');
				$("#loader").html("");
			}
		})
	}
	
	function per_page(valor){
		$("#per_page").val(valor);
		load(1);
		$('.dropdown-menu li' ).removeClass( "active" );
		$("#"+valor).addClass( "active" );
	}

		//La funcion siguiente elimina datos usando el plugins confirm		

		function eliminar(id){
			//https://craftpip.github.io/jquery-confirm/ documentacion
			$.confirm({
				title: 'Mensaje del sistema',
				content: 'Esta acción  eliminará de forma permanente la venta \n\n Desea continuar?',
				buttons: {
					somethingElse: {
					text: 'Aceptar',
					btnClass: 'btn-blue',
					
					action: function(){
						var parametros = {"id":id};
						$.ajax({
								type: "GET",	
								url:'ajax/eliminar/venta.php',
								data: parametros,
								 beforeSend: function(objeto){
								$("#loader").html("<img src='./img/ajax-loader.gif'>");
							  },
								success:function(data){
									$("#resultados_ajax").html(data);
									$("#loader").html("");
									window.setTimeout(function() {
									$(".alert").fadeTo(500, 0).slideUp(500, function(){
									$(this).remove();});}, 5000);
									
									load(1);
								}
							})
				
					}
				},
				    cancelar: function () {
						//No hace nada :P
					}
				}
			});
		}

	
	
		function view_pdf(id, type){
			console.log(type);
			if (type==1) {

			VentanaCentrada('sale-print-pdf.php?id='+id,'Ver PDF','','1024','768','true');

			}else{

			VentanaCentrada('sale-print-ticket-pdf.php?id='+id,'Ver PDF','','300','600','true');
			}
		}
		
	

	
	$(function() {
		$(".select2").select2();
				
		$( ".select2" ).select2({        
		ajax: {
			url: "ajax/customers_select2.php",
			dataType: 'json',
			delay: 250,
			data: function (params) {
				return {
					q: params.term // search term
				};
			},
			processResults: function (data) {
				// parse the results into the format expected by Select2.
				// since we are using custom formatting functions we do not need to
				// alter the remote JSON data
				return {
					results: data
				};
			},
			cache: true
		},
		minimumInputLength: 2,
		allowClear: true
	}).on('change', function (e) {
		load(1);
	});


	});
	
	