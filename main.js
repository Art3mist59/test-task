var tickets = [];
var all = document.querySelector('#all');
var nope = document.querySelector('#nope');
var one = document.querySelector('#one');
var two = document.querySelector('#two');
var three = document.querySelector('#three');
var cheap = document.querySelector('.buttons__item--cheap');
var fast = document.querySelector('.buttons__item--fast');
var ticketsDiv = document.querySelector('.tickets');

var makeElement = function (tagName, className, text) {

  var element = document.createElement(tagName);
  element.classList.add(className);

  if (text) {
    element.textContent = text;
  }

  return element;

};

var del= function(){
  var ticketList= document.querySelector('ul:first-child');
  ticketList.remove();
}

var ticketsOut = function(){

    var ticketsList = makeElement('ul','tickets__list');
    ticketsDiv.appendChild(ticketsList);

    for (var i = 0; i < 5; i++) {

      var ticketHundreds = tickets[i].price%1000;
      var ticketThousands = Math.floor(tickets[i].price/1000);

      if (ticketHundreds < 100) {
        ticketHundreds= '0'+ticketHundreds;
      }

      var ticketItem = makeElement('li','tickets__list--item');
      var div1 = makeElement('div','ticket__header');
      var ticketPrice = makeElement('span','ticket__price',ticketThousands+' '+ticketHundreds+' '+ 'Р');
      var ticketImg = makeElement('img','ticket__img');
      ticketImg.src = 'http://pics.avs.io/99/36/'+tickets[i].carrier+'.png'
      var div2 = makeElement('div','ticket__main');

      for (var g = 0; g<2; g++){

        var date = new Date(tickets[i].segments[g].date);
        var departureHours = date.getUTCHours();
        var departureMinutes = date.getUTCMinutes();
        var ariveHours = date.getUTCHours()+Math.floor(tickets[i].segments[g].duration/60);
        var ariveMinutes = date.getUTCMinutes()+tickets[i].segments[g].duration%60;
        var stopsMessage;

        if (tickets[i].segments[g].stops.length == 0) {
          stopsMessage = tickets[i].segments[g].stops.length+' Пересадок'
        }else if (tickets[i].segments[g].stops.length == 1) {
          stopsMessage = tickets[i].segments[g].stops.length+' Пересадка'
        }else{
          stopsMessage = tickets[i].segments[g].stops.length+' Пересадки'
        }

        while (ariveMinutes >= 60) {
          ariveMinutes -= 60;
        }
        while (ariveHours >= 24) {
          ariveHours -= 24;
        }
        if (ariveMinutes <= 9) {
          ariveMinutes = '0'+ariveMinutes
        }
        if (ariveHours <= 9) {
          ariveHours = '0'+ariveHours;
        }
        if (departureMinutes <= 9) {
          departureMinutes = '0'+departureMinutes;
        }
        if (departureHours <= 9) {
          departureHours = '0'+departureHours;
        }

        var div3 = makeElement('div','ticket--oneway');
        var fromToWhere = makeElement('div','ticket--fromtowhere');
        var fromToWhereText = makeElement('span','ticket--fromtowhere__text',tickets[i].segments[g].origin+' - '+tickets[i].segments[g].destination);
        var time = makeElement('span','ticket--fromtowhere__time',departureHours+':'+departureMinutes+' - '+ariveHours+':'+ariveMinutes);
        var durationBlock = makeElement('div','ticket--duration');
        var durationText = makeElement('span','ticket--duration__text','В ПУТИ');
        var duration = makeElement('span','tickets--duration__time',Math.floor(tickets[i].segments[g].duration/60) +'ч '+tickets[i].segments[g].duration%60+'м');
        var stopsBlock = makeElement('div','ticket--stops');
        var stopsText = makeElement('span','ticket--stops__text',stopsMessage);
        var stops = makeElement('span','ticket--stops__list',tickets[i].segments[g].stops);

        div3.appendChild(fromToWhere);
        div3.appendChild(durationBlock);
        div3.appendChild(stopsBlock);
        div2.appendChild(div3);
        fromToWhere.appendChild(fromToWhereText);
        fromToWhere.appendChild(time);
        durationBlock.appendChild(durationText);
        durationBlock.appendChild(duration);
        stopsBlock.appendChild(stopsText);
        stopsBlock.appendChild(stops);
      }

      ticketsList.appendChild(ticketItem);
      ticketItem.appendChild(div1);
      ticketItem.appendChild(div2);
      div1.appendChild(ticketPrice);
      div1.appendChild(ticketImg);

    };
}

fetch("http://localhost:3000/tickets")
   .then(response => {return response.json()})
   .then(data => {
    tickets = data;

    console.log(tickets);

    ticketsOut();

    cheap.onclick = function(){

      all.checked = false;
      nope.checked = false;
      one.checked = false;
      two.checked = false;
      three.checked = false;
      cheap.classList.add('buttons__item--checked');
      fast.classList.remove('buttons__item--checked');


      if (cheap.classList.contains('buttons__item--checked')) {
        for (var i = 0; i <=  tickets.length - 2; i++) {
          var minValue = tickets[i];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].price < minValue.price) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      }
    }

    fast.onclick = function(){

      all.checked = false;
      nope.checked = false;
      one.checked = false;
      two.checked = false;
      three.checked = false;

      fast.classList.add('buttons__item--checked');
      cheap.classList.remove('buttons__item--checked');

      if (fast.classList.contains('buttons__item--checked')) {
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[i];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if 
              (tickets[b].segments[0].duration < minValue.segments[0].duration && 
              tickets[b].segments[1].duration < minValue.segments[1].duration && 
              tickets[b].segments[0].duration < minValue.segments[1].duration && 
              tickets[b].segments[1].duration < minValue.segments[0].duration) 
            {

              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;

            }
          }
        }
        del()
        ticketsOut();
      }
    }

    all.onchange = function(element) {
      if(all.checked && !cheap.classList.contains('buttons__item--checked') && !fast.classList.contains('buttons__item--checked')){
        del()
        ticketsOut();
      };
      if(all.checked && cheap.classList.contains('buttons__item--checked') && !fast.classList.contains('buttons__item--checked')){
        for (var i = 0; i <=  tickets.length - 2; i++) {
          var minValue = tickets[i];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].price < minValue.price) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      };
      if(all.checked && !cheap.classList.contains('buttons__item--checked') && fast.classList.contains('buttons__item--checked')){
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[i];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if 
              (tickets[b].segments[0].duration < minValue.segments[0].duration && 
              tickets[b].segments[1].duration < minValue.segments[1].duration && 
              tickets[b].segments[0].duration < minValue.segments[1].duration && 
              tickets[b].segments[1].duration < minValue.segments[0].duration) 
            {

              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;

            }
          }
        }
        del()
        ticketsOut();
      };
    };
    nope.onchange = function(element) {

      if (nope.checked && !cheap.classList.contains('buttons__item--checked') &&!fast.classList.contains('buttons__item--checked') ) {
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[i];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].segments[0].stops.length == 0 && 
              tickets[b].segments[1].stops.length == 0) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      }

      if (nope.checked && cheap.classList.contains('buttons__item--checked')) {
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[tickets.length - 2];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].segments[0].stops.length == 0 && 
              tickets[b].segments[1].stops.length == 0 && tickets[b].price < minValue.price) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      }
      if (nope.checked && fast.classList.contains('buttons__item--checked')) {
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[tickets.length - 2];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].segments[0].stops.length == 0 && 
              tickets[b].segments[1].stops.length == 0 && 
              tickets[b].segments[0].duration < minValue.segments[0].duration && 
              tickets[b].segments[1].duration < minValue.segments[1].duration && 
              tickets[b].segments[0].duration < minValue.segments[1].duration && 
              tickets[b].segments[1].duration < minValue.segments[0].duration) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      }
    };
    one.onchange = function(element) {

      if (one.checked && !cheap.classList.contains('buttons__item--checked') &&!fast.classList.contains('buttons__item--checked') ) {
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[i];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].segments[0].stops.length == 1 && 
              tickets[b].segments[1].stops.length == 1) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      }

      if (one.checked && cheap.classList.contains('buttons__item--checked')) {
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[tickets.length - 2];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].segments[0].stops.length == 1 && 
              tickets[b].segments[1].stops.length == 1 && tickets[b].price < minValue.price) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      }
      if (one.checked && fast.classList.contains('buttons__item--checked')) {
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[tickets.length - 2];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].segments[0].stops.length == 1 && 
              tickets[b].segments[1].stops.length == 1 && 
              tickets[b].segments[0].duration < minValue.segments[0].duration && 
              tickets[b].segments[1].duration < minValue.segments[1].duration && 
              tickets[b].segments[0].duration < minValue.segments[1].duration && 
              tickets[b].segments[1].duration < minValue.segments[0].duration) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      }
    };
    two.onchange = function(element) {
      if (two.checked && !cheap.classList.contains('buttons__item--checked') &&!fast.classList.contains('buttons__item--checked')) {
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[i];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].segments[0].stops.length == 2 && 
              tickets[b].segments[1].stops.length == 2) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      }
      if (two.checked && cheap.classList.contains('buttons__item--checked')) {
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[tickets.length - 2];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].segments[0].stops.length == 2 && 
              tickets[b].segments[1].stops.length == 2 && tickets[b].price < minValue.price) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      }
      if (two.checked && fast.classList.contains('buttons__item--checked')) {
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[tickets.length - 2];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].segments[0].stops.length == 2 && 
              tickets[b].segments[1].stops.length == 2 && 
              tickets[b].segments[0].duration < minValue.segments[0].duration && 
              tickets[b].segments[1].duration < minValue.segments[1].duration && 
              tickets[b].segments[0].duration < minValue.segments[1].duration && 
              tickets[b].segments[1].duration < minValue.segments[0].duration) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      }
    };
    three.onchange = function(element) {

      if (three.checked && !cheap.classList.contains('buttons__item--checked') &&!fast.classList.contains('buttons__item--checked')) {
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[i];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].segments[0].stops.length == 3 && 
              tickets[b].segments[1].stops.length == 3) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      }

      if (three.checked && cheap.classList.contains('buttons__item--checked')) {
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[tickets.length - 2];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].segments[0].stops.length == 3 && 
              tickets[b].segments[1].stops.length == 3 && tickets[b].price < minValue.price) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      }

      if (three.checked && fast.classList.contains('buttons__item--checked')) {
        for (var i = 0; i <= tickets.length - 2; i++) {
          var minValue = tickets[tickets.length - 2];

          for (var b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].segments[0].stops.length == 3 && 
              tickets[b].segments[1].stops.length == 3 && 
              tickets[b].segments[0].duration < minValue.segments[0].duration && 
              tickets[b].segments[1].duration < minValue.segments[1].duration && 
              tickets[b].segments[0].duration < minValue.segments[1].duration && 
              tickets[b].segments[1].duration < minValue.segments[0].duration) {
              minValue = tickets[b];
              var swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
        del()
        ticketsOut();
      }
    };
})
