const $ = (id) => document.getElementById(id);
const keys = {cv:"jrsa_cv", apps:"jrsa_apps", answers:"jrsa_answers"};
function read(key, fallback){try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}}
function write(key,value){localStorage.setItem(key,JSON.stringify(value))}
function go(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===id));
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.go===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
const cvFields=["fullName","email","phone","location","summary","experience","education","skills"];
function loadCV(){const data=read(keys.cv,{});cvFields.forEach(id=>{if($(id))$(id).value=data[id]||""})}
function cvData(){return Object.fromEntries(cvFields.map(id=>[id,$(id).value.trim()]))}
$("cvForm").addEventListener("submit",e=>{e.preventDefault();write(keys.cv,cvData());$("cvStatus").textContent="Saved on this device."});
$("previewCV").addEventListener("click",()=>{
  const d=cvData();write(keys.cv,d);
  if(!d.fullName){$("cvStatus").textContent="Please enter your full name before previewing.";return}
  const section=(title,value)=>value?`<h3>${title}</h3><p>${escapeHTML(value)}</p>`:"";
  $("cvPreview").innerHTML=`<h2>${escapeHTML(d.fullName)}</h2><div class="cv-contact">${[d.email,d.phone,d.location].filter(Boolean).map(escapeHTML).join(" · ")}</div>${section("Professional profile",d.summary)}${section("Work experience",d.experience)}${section("Education",d.education)}${section("Skills",d.skills)}`;
  $("cvPreview").classList.remove("hidden");$("cvStatus").textContent="Preview ready. Use your browser menu → Print → Save as PDF."; $("cvPreview").scrollIntoView({behavior:"smooth"});
});
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("letterForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("letterName").value.trim()||"[Your name]", employer=$("employer").value.trim()||"[Company]", role=$("role").value.trim()||"[Position]", strengths=$("strengths").value.trim()||"[Add relevant skills and experience]";
  $("letterText").value=`${name}\n\nDear Hiring Manager,\n\nI am writing to apply for the ${role} position at ${employer}. I am interested in this opportunity because it aligns with my skills and career goals.\n\n${strengths}\n\nI would welcome the opportunity to discuss how my abilities could contribute to your team. Thank you for considering my application.\n\nKind regards,\n${name}`;
  $("letterOutput").classList.remove("hidden");
});
$("copyLetter").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("letterText").value);$("copyLetter").textContent="Copied!"}catch{$("letterText").select();$("copyLetter").textContent="Select and copy"}});
const questions=[
["Tell me about yourself.","Give a brief work-focused introduction: your background, relevant strengths and what you are looking for."],
["Why do you want this job?","Connect your interest to the actual role, the employer and what you can contribute."],
["What are your greatest strengths?","Choose two or three strengths and support them with real examples."],
["What is one area you are working to improve?","Be honest. Explain what you are doing to improve rather than giving a fake weakness."],
["Tell me about a time you solved a problem.","Use STAR: Situation, Task, Action and Result. A school, volunteer or personal example can be relevant."],
["How do you handle pressure?","Describe a practical method you use to prioritise, stay calm and communicate."],
["Why should we hire you?","Summarise the most relevant skills, attitude and evidence you can bring to this role."],
["Do you have any questions for us?","Ask about the role's priorities, team, training or what success looks like in the first few months."]
];
let qIndex=0, answers=read(keys.answers,{});
function showQuestion(){const [q,t]=questions[qIndex];$("questionCount").textContent=`QUESTION ${qIndex+1} OF ${questions.length}`;$("questionText").textContent=q;$("questionTip").textContent=t;$("answerBox").value=answers[qIndex]||"";$("prevQuestion").disabled=qIndex===0;$("nextQuestion").textContent=qIndex===questions.length-1?"Back to first":"Next question"}
$("answerBox").addEventListener("input",()=>{answers[qIndex]=$("answerBox").value;write(keys.answers,answers);$("answerStatus").textContent="Practice answer saved on this device."});
$("prevQuestion").addEventListener("click",()=>{if(qIndex>0){qIndex--;showQuestion()}});
$("nextQuestion").addEventListener("click",()=>{qIndex=(qIndex+1)%questions.length;showQuestion()});
function renderApps(){
 const apps=read(keys.apps,[]);$("applicationCount").textContent=apps.length;
 if(!apps.length){$("applicationList").innerHTML='<div class="empty">No applications added yet.</div>';return}
 $("applicationList").innerHTML=apps.map((a,i)=>`<article class="app-card"><button data-delete="${i}" aria-label="Delete application">Delete</button><strong>${escapeHTML(a.role)} — ${escapeHTML(a.company)}</strong><small>Applied: ${escapeHTML(a.date)}</small><div class="field"><label>Status</label><select data-status="${i}">${["Applied","Interview","Follow-up needed","Offer received","Unsuccessful"].map(s=>`<option ${a.status===s?"selected":""}>${s}</option>`).join("")}</select></div>${a.notes?`<small>${escapeHTML(a.notes)}</small>`:""}</article>`).join("");
 document.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>{const list=read(keys.apps,[]);list.splice(Number(b.dataset.delete),1);write(keys.apps,list);renderApps()}));
 document.querySelectorAll("[data-status]").forEach(s=>s.addEventListener("change",()=>{const list=read(keys.apps,[]);list[Number(s.dataset.status)].status=s.value;write(keys.apps,list)}));
}
$("trackerForm").addEventListener("submit",e=>{e.preventDefault();const list=read(keys.apps,[]);list.unshift({company:$("trackCompany").value.trim(),role:$("trackRole").value.trim(),date:$("trackDate").value,status:$("trackStatus").value,notes:$("trackNotes").value.trim()});write(keys.apps,list);e.target.reset();renderApps()});
loadCV();showQuestion();renderApps();
if("serviceWorker" in navigator && location.protocol.startsWith("http")){navigator.serviceWorker.register("sw.js").catch(()=>{});}
