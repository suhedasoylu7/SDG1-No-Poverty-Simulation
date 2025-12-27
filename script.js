$(document).ready(()=>{

$("#backHomeBtn").click(() => {
  window.location.href = "index.html"; // redirects back to landing page
});

// --------------------
// SMOOTH SCROLL NAVIGATION
// --------------------
$("#navbar a").click(function(e){
  const target = $(this).attr("href");

  if (target.startsWith("#")) {
    e.preventDefault();
    const el = $(target);
    if (el.length) {
      $('html, body').animate({
        scrollTop: el.offset().top - 50
      }, 600);
    }
  }
});

// Landing buttons scroll
$("#startBtn").click(()=>{
  window.location.href = "simulation.html";
});
$("#learnBtn").click(()=>{
  $('html, body').animate({
    scrollTop: $("#sdg-info").offset().top - 50
  }, 600);
});
$("#goMyths").click(()=>{
  $('html, body').animate({
    scrollTop: $("#myths").offset().top - 50
  }, 600);
});
$("#toSDG").click(()=>{
  $('html, body').animate({
    scrollTop: $("#sdg-info").offset().top - 50
  }, 600);
});

// --------------------
// Simulation Setup
// --------------------
let money=0, food=100, stress=0, day=1;
let selectedIncome=null, selectedFamily=null;

$(".income").click(function(){ selectedIncome=Number(this.dataset.income); checkReady(); });
$(".family").click(function(){ selectedFamily=Number(this.dataset.family); checkReady(); });

function checkReady(){ $("#beginSim").prop("disabled", !(selectedIncome && selectedFamily)); }

$("#beginSim").click(()=>{
  money=selectedIncome; food=100; stress=0; day=1;
  updateStatus(); loadEvent();
  $('html, body').animate({scrollTop: $("#simulation").offset().top - 50}, 600);
});

// --------------------
// Status & Events
// --------------------
const events = [
  { day:1, title:"Monthly Rent Due", text:"Your rent costs RM 600 this month.", choices:[
      {text:"Pay full rent (RM 600)", cost:600, stress:0},
      {text:"Pay partially (RM 300)", cost:300, stress:20},
      {text:"Skip rent", cost:0, stress:40}
  ]},
  { day:2, title:"Groceries Needed", text:"You need to buy food for the household.", choices:[
      {text:"Buy enough food (RM 200)", cost:200, stress:0},
      {text:"Buy cheap food (RM 100)", cost:100, stress:10},
      {text:"Skip groceries", cost:0, stress:25}
  ]},
  { day:5, title:"Transportation Costs", text:"Daily transport costs add up.", choices:[
      {text:"Pay transport (RM 100)", cost:100, stress:0},
      {text:"Walk long distances", cost:0, stress:15}
  ]},
  { day:10, title:"Medical Expense", text:"Someone in the family feels unwell.", choices:[
      {text:"Visit clinic (RM 150)", cost:150, stress:0},
      {text:"Buy basic medicine (RM 50)", cost:50, stress:10},
      {text:"Ignore symptoms", cost:0, stress:30}
  ]}
];

function updateStatus(){
  $("#money").text(money);
  $("#food").text(food);
  $("#stress").text(stress);
  $("#day").text(day);
}

function loadEvent(){
  const event = events.find(e=>e.day===day);
  $("#choices").empty();
  if(event){
    $("#event-title").text(event.title);
    $("#event-text").text(event.text);
    event.choices.forEach(c=>{
      const btn=$("<button>").text(c.text).click(()=>makeChoice(c.cost,c.stress));
      $("#choices").append(btn);
    });
  } else {
    $("#event-title").text("Daily Living Costs");
    $("#event-text").text("Basic daily expenses are unavoidable.");
    const btn=$("<button>").text("Pay daily expenses (RM 50)").click(()=>makeChoice(50,5));
    $("#choices").append(btn);
  }
}

function makeChoice(cost,stressChange){
  money-=cost; stress+=stressChange; food-=10; day++;
  checkGameState(); updateStatus(); loadEvent();
}

function checkGameState(){
  if(money<0){ endGame("You ran out of money before the month ended."); return; }
  if(stress>=100){ endGame("Stress became overwhelming."); return; }
  if(food<=0){ food=0; stress+=20; }
  if(day>30){ endGame("You survived the month, but every decision required sacrifice."); }
}

function endGame(message){
  $("#outcome-title").text("Simulation Result");
  $("#outcome-text").text(message);
  $('html, body').animate({scrollTop: $("#outcome").offset().top - 50}, 600);
}

// --------------------
// Myth Reveal
// --------------------
$(".reveal").click(function(){ $(this).next(".reality").toggleClass("hidden"); });
$("#restartBtn").click(()=>{
  money=0; food=100; stress=0; day=1;
  selectedIncome=null; selectedFamily=null;
  $("#beginSim").prop("disabled", true);
  $('html, body').animate({scrollTop: $("#landing").offset().top - 50}, 600);
});

// --------------------
// Carousel
// --------------------
const images=[
  {src:"images/poverty1.jpg", caption:"Poverty affects access to food, housing, healthcare, and education."},
  {src:"images/poverty2.jpg", caption:"Many people in poverty are working, but wages are not enough."},
  {src:"images/poverty3.jpg", caption:"Unexpected costs can push families deeper into poverty."},
  {src:"images/poverty4.jpg", caption:"Access to clean water is a daily challenge for many families living in poverty."},
  {src:"images/poverty5.jpg", caption:"Limited income leaves little room for essential expenses."}
];
let currentIndex=0, carouselInterval;

function updateCarousel(){
  $("#carouselImage").fadeOut(200);
  $("#carouselCaption").fadeOut(200,function(){
    $("#carouselImage").attr("src",images[currentIndex].src);
    $("#carouselCaption").text(images[currentIndex].caption);
    $("#carouselImage").fadeIn(200);
    $("#carouselCaption").fadeIn(200);
  });
}

function startCarousel(){
  carouselInterval = setInterval(()=>{
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  }, 3000);
}

function stopCarousel(){ clearInterval(carouselInterval); }

$("#nextBtn").click(()=>{ currentIndex = (currentIndex + 1) % images.length; updateCarousel(); });
$("#prevBtn").click(()=>{ currentIndex = (currentIndex - 1 + images.length) % images.length; updateCarousel(); });

$("#carousel").hover(stopCarousel, startCarousel);
startCarousel();

});