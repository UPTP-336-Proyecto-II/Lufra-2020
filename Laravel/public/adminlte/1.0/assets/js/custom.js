/*
=========================================
|                                       |
|           Scroll To Top               |
|                                       |
=========================================
*/ 
$('.scrollTop').click(function() {
    $("html, body").animate({scrollTop: 0});
});

/*
=========================================
|                                       |
|               Tooltips                |
|                                       |
=========================================
*/

$('.bs-tooltip').tooltip();

/*
=========================================
|                                       |
|               Popovers                |
|                                       |
=========================================
*/

$('.bs-popover').popover();


/*
================================================
|                                              |
|               Rounded Tooltip                |
|                                              |
================================================
*/

$('.t-dot').tooltip({
    template: '<div class="tooltip status rounded-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
})


/*
================================================
|            IE VERSION Dector                 |
================================================
*/

function GetIEVersion() {
  var sAgent = window.navigator.userAgent;
  var Idx = sAgent.indexOf("MSIE");

  // If IE, return version number.
  if (Idx > 0) 
    return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));

  // If IE 11 then look for Updated user agent string.
  else if (!!navigator.userAgent.match(/Trident\/7\./)) 
    return 11;

  else
    return 0; //It is not IE
}



/*
================================================
|    settings  |   Set value  |  
================================================
*/

$(document).ready(function () {
  
  $('#sales_status').is(':checked');

})
/*
================================================
|    Cashier    |   P.O.S     
================================================
*/

    async function customer_paying(cashier) {
   const {
        value: numberinput,
        isConfirmed,
        isDismissed
      } = await Swal.fire({
          title: 'Dinero en Caja',
          text: 'el cambio del "cliente!" , restará la cantidad. de apertura de la caja.',
          icon: 'cash',
          showCancelButton: false,
          confirmButtonText: 'Abrir!',
          reverseButtons: true,
          input: 'number',
          inputLabel: 'portion size: \n ‍',
          inputAttributes: {
          min: 1,
          max: 20,
          step: 1
         },
         inputValue: 1,
     })

  }


  async function cashier(cashier, id) {
     const {
          value: numberinput,
          isConfirmed,
          isDismissed
        } = await Swal.fire({
          title: 'Estas aperturando como ' + cashier + ' estás seguro?',
          text: 'Cuando presiones el botón "Abrir!" , abrias con la cantidad.',
          icon: 'information',
          showCancelButton: true,
          cancelButtonColor: '#00c0ef',
          confirmButtonColor: '#00c0ef',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Abrir!',
          reverseButtons: true,
          input: 'number',
          inputLabel: 'portion size: \n ‍',
          inputPlaceholder: 'Enter portion',
          inputAttributes: {
            min: 1,
            max: 20,
            step: 1
          },
          inputValue: 1,
          }).then(function(result) {
            if (result.value) {
                window.livewire.emit('openPos', id)
                swal.close()
            }
        });

      

      
}


