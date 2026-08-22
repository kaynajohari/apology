/* =========================================
   EDIT THESE FOR YOUR BOYFRIEND
   ========================================= */
const CUSTOM = {
  boyfriendName: "MY BOYFRIEND",
  girlfriendName: "YOUR GIRLFRIEND",

  questions: [
    {
      question: "What does your girlfriend do when she is clearly wrong?",
      answers: ["Admit it immediately","Become defensive","Pretend nothing happened","Somehow make it your fault"],
      correct: 3,
      wrong: "That answer has been reported. 😭",
      right: "Unfortunately, you know me too well."
    },
    {
      question: "Who is more dramatic?",
      answers: ["Me","You","Both of us","This question is dangerous"],
      correct: 3,
      wrong: "You have chosen danger.",
      right: "CORRECT. I value your survival instincts."
    },
    {
      question: "What happens after we argue?",
      answers: ["We never speak again","We become normal eventually","One of us sends something stupid","Somehow we end up being cute again"],
      correct: 3,
      wrong: "You clearly forgot the lore.",
      right: "Okayyyy, you know us."
    },
    {
      question: "What is the most scientifically accurate description of us?",
      answers: ["Normal couple","Two peaceful adults","Cute idiots with occasional software bugs","A highly functioning institution"],
      correct: 2,
      wrong: "Incorrect. Please review the evidence.",
      right: "Finally. Someone understands the lore."
    },
    {
      question: "Most importantly: what should happen now?",
      answers: ["More arguing","Ignore each other","Forgive your girlfriend","File a formal complaint"],
      correct: 2,
      wrong: "Interesting choice. I will be filing an emotional complaint.",
      right: "YES. VERY IMPORTANT. ❤️"
    }
  ],

  memories: [
    {file:"assets/photo1.jpg", emoji:"📸", title:"PHOTO 01", caption:"Evidence that you are actually very cute."},
    {file:"assets/photo2.jpg", emoji:"😂", title:"PHOTO 02", caption:"Proof that we have absolutely no normal pictures."},
    {file:"assets/photo3.jpg", emoji:"🥹", title:"PHOTO 03", caption:"One of my favourite memories with you."},
    {file:"assets/photo4.jpg", emoji:"💗", title:"PHOTO 04", caption:"Unfortunately, I really really like this idiot."},
    {file:"assets/photo5.jpg", emoji:"🫶", title:"PHOTO 05", caption:"Proof that one argument does not erase all of this."}
  ],

  apology: `Okay, jokes aside…

I’m really sorry. 🥺

I know we had an argument, and I hate that I upset you.

You mean way too much to me for one stupid argument to overshadow everything else.

I love you, I appreciate you, and I really hope you know that.

Now please stop being mad at me because I miss you. 😭

Love,
your favourite idiot ❤️`,

  ending: "YAYYYYY 😭❤️ MISSION ACCOMPLISHED. Now come here."
};

/* ========================================= */

const $ = s => document.querySelector(s);
const screens = [...document.querySelectorAll(".screen")];
const go = id => {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo({top:0, behavior:"smooth"});
};

/* HOME */
$("#start").addEventListener("click", () => go("quiz"));

/* QUIZ */
let qIndex = 0;
let selected = null;
let locked = false;

function renderQuestion(){
  const q = CUSTOM.questions[qIndex];
  selected = null;
  locked = false;
  $("#question").textContent = q.question;
  $("#qCount").textContent = `QUESTION ${qIndex+1} / ${CUSTOM.questions.length}`;
  $("#qProgress").style.width = `${((qIndex+1)/CUSTOM.questions.length)*100}%`;
  $("#feedback").textContent = "";
  $("#lock").disabled = true;
  $("#lock").textContent = "LOCK ANSWER";

  const box = $("#answers");
  box.innerHTML = "";

  q.answers.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer";
    btn.textContent = text;
    btn.addEventListener("click", () => {
      if(locked) return;
      selected = i;
      [...box.children].forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      $("#lock").disabled = false;
      $("#feedback").textContent = "Answer selected. Lock it in 👀";
    });
    box.appendChild(btn);
  });
}

$("#lock").addEventListener("click", () => {
  if(selected === null || locked) return;
  locked = true;
  const q = CUSTOM.questions[qIndex];
  const buttons = [...$("#answers").children];
  buttons.forEach(b => b.classList.remove("selected"));
  buttons[selected].classList.add(selected === q.correct ? "correct" : "wrong");

  $("#feedback").textContent = selected === q.correct ? q.right : q.wrong;

  if(qIndex < CUSTOM.questions.length - 1){
    $("#lock").textContent = "NEXT QUESTION →";
    $("#lock").disabled = false;
    $("#lock").onclick = () => {
      $("#lock").onclick = null;
      qIndex++;
      renderQuestion();
    };
  } else {
    $("#lock").textContent = "CONTINUE →";
    $("#lock").disabled = false;
    $("#lock").onclick = () => {
      $("#feedback").textContent = "QUIZ COMPLETE ✅ Relationship knowledge: suspiciously high.";
      $("#lock").textContent = "CONTINUE →";
      $("#lock").onclick = () => {
        $("#lock").onclick = null;
        go("flags");
      };
    };
  }
});
renderQuestion();

/* RED FLAG GAME */
const arena = $("#arena");
const player = $("#player");
let playerX = 0.5, running = false, score = 0, raf = 0, last = 0, endAt = 0, flags = [];

function movePlayer(delta){
  if(!running) return;
  playerX = Math.max(.07, Math.min(.93, playerX + delta));
  player.style.left = `${playerX*100}%`;
}
$("#left").addEventListener("click", () => movePlayer(-.08));
$("#right").addEventListener("click", () => movePlayer(.08));
document.addEventListener("keydown", e => {
  if(!running) return;
  if(e.key === "ArrowLeft") movePlayer(-.06);
  if(e.key === "ArrowRight") movePlayer(.06);
});

function spawnFlag(){
  const el = document.createElement("div");
  el.className = "flag";
  const labels = ["being stubborn","overthinking","bad communication","ego","saying something dumb","not listening"];
  el.innerHTML = `🚩<small>${labels[Math.floor(Math.random()*labels.length)]}</small>`;
  el.x = .06 + Math.random()*.88;
  el.y = -35;
  el.speed = 110 + Math.random()*100;
  el.style.left = `${el.x*100}%`;
  arena.appendChild(el);
  flags.push(el);
}

function loop(t){
  if(!running) return;
  if(!last) last=t;
  const dt = Math.min(.04,(t-last)/1000);
  last=t;

  flags.forEach(f => {
    f.y += f.speed*dt;
    f.style.transform = `translateY(${f.y}px)`;
    const a = player.getBoundingClientRect(), b = f.getBoundingClientRect();
    if(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top){
      f.dead = true;
      f.remove();
      $("#gameMessage").textContent = "OW 😭 That one was unfortunately based on real events.";
    }
    if(f.y > arena.clientHeight + 50 && !f.dead){
      f.dead = true;
      f.remove();
      score++;
      $("#score").textContent = score;
    }
  });

  flags = flags.filter(f => !f.dead);
  $("#timer").textContent = Math.max(0,Math.ceil((endAt-performance.now())/1000));

  if(performance.now() >= endAt){
    running = false;
    flags.forEach(f => f.remove());
    flags = [];
    cancelAnimationFrame(raf);
    $("#startGame").disabled = false;
    $("#startGame").textContent = "CONTINUE →";
    $("#startGame").onclick = () => {
      $("#startGame").onclick = null;
      go("evidence");
    };
    $("#gameMessage").textContent = `MISSION ACCOMPLISHED. You dodged ${score} red flags. Mostly. 🚩❤️`;
    return;
  }

  if(Math.random() < dt*2.5) spawnFlag();
  raf = requestAnimationFrame(loop);
}

$("#startGame").addEventListener("click", () => {
  if(running) return;
  score=0; playerX=.5; flags.forEach(f=>f.remove()); flags=[];
  $("#score").textContent="0"; $("#timer").textContent="15";
  player.style.left="50%";
  $("#gameMessage").textContent="DODGE. THE. FLAGS.";
  $("#startGame").disabled=true;
  running=true;
  endAt=performance.now()+15000;
  last=0;
  raf=requestAnimationFrame(loop);
});

/* EVIDENCE */
let reviewed = 0;
const memories = $("#memories");

CUSTOM.memories.forEach((m, i) => {
  const card = document.createElement("button");
  card.className = "memory";
  card.type = "button";

  const img = document.createElement("img");
  img.src = m.file;
  img.alt = m.title;
  img.onerror = () => {
    img.style.display = "none";
    fallback.style.display = "grid";
  };

  const fallback = document.createElement("div");
  fallback.className = "fallback";
  fallback.textContent = m.emoji;

  const label = document.createElement("span");
  label.textContent = m.title;

  card.append(img,fallback,label);
  card.addEventListener("click", () => {
    if(!card.dataset.seen){
      card.dataset.seen="true";
      reviewed++;
      $("#evidenceCount").textContent = `EVIDENCE REVIEWED: ${reviewed} / ${CUSTOM.memories.length}`;
      if(reviewed === CUSTOM.memories.length){
        $("#verdict").disabled=false;
        $("#evidenceCount").textContent = "ALL EVIDENCE REVIEWED. The verdict is devastatingly obvious. ❤️";
      }
    }
    openModal(m);
  });
  memories.appendChild(card);
});

function openModal(m){
  $("#modalTitle").textContent = m.title;
  $("#modalText").textContent = m.caption;
  $("#modal").classList.add("show");
  $("#modal").setAttribute("aria-hidden","false");
  const img=$("#modalImage"), fallback=$("#modalFallback");
  img.src=m.file;
  img.onload=()=>{img.style.display="block";fallback.style.display="none"};
  img.onerror=()=>{img.style.display="none";fallback.style.display="grid";fallback.textContent=m.emoji};
}
function closeModal(){
  $("#modal").classList.remove("show");
  $("#modal").setAttribute("aria-hidden","true");
}
$("#closeModal").addEventListener("click",closeModal);
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal") closeModal()});
$("#verdict").addEventListener("click",()=>go("security"));

/* FINAL SECURITY */
document.querySelectorAll("#finalAnswers .answer").forEach(btn => {
  btn.addEventListener("click",()=>{
    document.querySelectorAll("#finalAnswers .answer").forEach(b=>b.classList.remove("selected","wrong","correct"));
    btn.classList.add("selected");

    if(btn.dataset.correct === "true"){
      btn.classList.remove("selected");
      btn.classList.add("correct");
      $("#finalFeedback").textContent="ACCESS GRANTED. I knew you would get it. 🥺❤️";
      burst();
      setTimeout(()=>go("apology"),700);
    } else {
      btn.classList.remove("selected");
      btn.classList.add("wrong");
      $("#finalFeedback").textContent="Be serious. 😭 Try again.";
    }
  });
});

/* APOLOGY */
$("#loveNote").textContent = CUSTOM.apology;
const video = $("#apologyVideo");
const placeholder = $("#videoPlaceholder");
video.addEventListener("loadeddata",()=>{
  video.style.display="block";
  placeholder.style.display="none";
});
video.addEventListener("error",()=>{
  video.style.display="none";
  placeholder.style.display="grid";
});

$("#forgive").addEventListener("click",()=>{
  burst();
  $("#ending").textContent = CUSTOM.ending;
  $("#forgive").textContent = "I LOVE YOU TOO 💗";
});

/* CONFETTI */
function burst(){
  const box=$("#confetti");
  box.innerHTML="";
  const chars=["❤️","💗","💕","✨","🥺","🎀","💌"];
  for(let i=0;i<55;i++){
    const p=document.createElement("span");
    p.className="piece";
    p.textContent=chars[Math.floor(Math.random()*chars.length)];
    p.style.left=`${Math.random()*100}%`;
    p.style.animationDelay=`${Math.random()*.7}s`;
    box.appendChild(p);
  }
  setTimeout(()=>box.innerHTML="",3200);
}
