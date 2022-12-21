let tickets = [];
let cheap = document.querySelector('.buttons__item--cheap');
let fast = document.querySelector('.buttons__item--fast');

fetch("http://localhost:3000/tickets")
   .then(response => {return response.json()})
   .then(data => {
    tickets=data;
    console.log(tickets);

    cheap.onclick = function(){

      cheap.classList.add('buttons__item--checked');
      fast.classList.remove('buttons__item--checked');


      if (cheap.classList.contains('buttons__item--checked')) {
        console.log(tickets);
        for (let i = 0; i <= tickets.length - 2; i++) {
          let minValue = tickets[i];

          for (let b = i + 1; b <= tickets.length - 1; b++) {
            if (tickets[b].price < minValue.price) {
              minValue = tickets[b];
              let swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
      }
    }

    fast.onclick = function(){

      fast.classList.add('buttons__item--checked');
      cheap.classList.remove('buttons__item--checked');

      if (fast.classList.contains('buttons__item--checked')) {
        for (let i = 0; i <= tickets.length - 2; i++) {
          let minValue = tickets[i];

          for (let b = i + 1; b <= tickets.length - 1; b++) {
            if 
              (tickets[b].segments[0].duration < minValue.segments[0].duration && 
              tickets[b].segments[1].duration < minValue.segments[1].duration && 
              tickets[b].segments[0].duration < minValue.segments[1].duration && 
              tickets[b].segments[1].duration < minValue.segments[0].duration) 
            {

              minValue = tickets[b];
              let swap = tickets[i];
              tickets[i] = minValue;
              tickets[b] = swap;
            }
          }
        }
      }
    }
})
