
function breaktext(params) {
    
    var climimg = document.querySelector('.climax')
    var climtext = climimg.textContent
    var splitetext = climtext.split("")
    var halfvalue = splitetext.length/2
    var clutter =""
    splitetext.forEach(function(ele,idx){
        if (idx<halfvalue) { 
            clutter += `<span class="aleft">${ele}</span>`
        } else {
            clutter += `<span class="aright">${ele}</span>`
        }
    })
    climimg.innerHTML = clutter
    
}

breaktext()

gsap.from(".loGO", {
    x:-60,
    opacity:0,
    duration:0.5,
    delay:0.5,
    // stagger:0.2
})

gsap.from(".climax .aleft", {
    y:60,
    opacity:0,
    duration:0.7,
    delay:0.5,
    stagger:0.2
})
gsap.from(".climax .aright", {
    y:60,
    opacity:0,
    duration:0.7,
    delay:0.5,
    stagger:-0.2
})
gsap.from(".input", {
    x:60,
    opacity:0,
    duration:0.5,
    delay:0.5
})

gsap.from('.degree ,.locationImage , .countryname , .Calender, .date',{
    x:-20,
    opacity:0,
    duration:1,
    delay:0.5,
    stagger:0.2
})
gsap.from(' .idimage ,.main',{
    y:20,
    opacity:0,
    duration:1,
    delay:0.5,
    stagger:0.8
})

gsap.from(' .high , .justtocover',{
    y:20,
    opacity:0,
    duration:0.8,
    delay:0.5,
    stagger:0.1
})


gsap.from('.weektext ,.weekly ',{
    y:30,
    opacity:0,
    duration:1,
    delay:0.5,
    stagger:1
})

gsap.from('.todaytext ,.todays-info ',{
    y:30,
    opacity:0,
    duration:1.2,
    delay:0.5,
    stagger:1
})








