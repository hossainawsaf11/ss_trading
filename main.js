/* SS Trading website: routing, build-berth animation, newbuild cost estimator, share and enquiry form. */
(function(){
  var order=["home","build","consulting","supply","projects","insights","company","contact"];
  var pages=[].slice.call(document.querySelectorAll("[data-page]"));
  var navLinks=[].slice.call(document.querySelectorAll(".nav a"));
  var nav=document.getElementById("nav"),btn=document.getElementById("menuBtn");
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

  function postCard(a){
    return '<a class="post" href="#'+a.slug+'"><span class="tag">'+esc(a.cat)+'</span><h3>'+esc(a.title)+'</h3><p>'+esc(a.summary)+'</p><span class="meta">'+esc(a.date)+' · '+esc(a.read)+'</span><span class="more">Read article →</span></a>';
  }
  document.getElementById("allPosts").innerHTML=ARTICLES.map(postCard).join("");
  document.getElementById("homePosts").innerHTML=ARTICLES.slice(0,3).map(postCard).join("");

  function renderArticle(a){
    var url=SITE+"#"+a.slug;
    var body=a.body.map(function(b){
      if(b[0]==="h") return "<h2>"+esc(b[1])+"</h2>";
      if(b[0]==="ul") return "<ul>"+b[1].map(function(x){return "<li>"+esc(x)+"</li>"}).join("")+"</ul>";
      return "<p>"+esc(b[1])+"</p>";
    }).join("");
    document.getElementById("artView").innerHTML=
      '<a class="back" href="#insights">← All insights</a>'+
      '<span class="tag">'+esc(a.cat)+'</span><h1 style="font-size:clamp(1.9rem,4vw,2.8rem)">'+esc(a.title)+'</h1>'+
      '<p class="meta">'+esc(a.author)+' · '+esc(a.date)+' · '+esc(a.read)+'</p>'+
      shareBar(a,url)+'<div class="article-body">'+body+'</div>'+
      '<div class="endcta"><p class="eyebrow" style="color:var(--cyan)">Planning a vessel or a supply order?</p><h3 style="font-size:1.4rem">Talk to the team that manages builds in Bangladesh and Kenya.</h3><div class="btns"><a class="btn solid" href="#contact">Start a project <span class="arr">→</span></a></div></div>'+
      shareBar(a,url);
  }
  function shareBar(a,url){
    var li="https://www.linkedin.com/sharing/share-offsite/?url="+encodeURIComponent(url);
    var wa="https://wa.me/?text="+encodeURIComponent(a.title+" "+url);
    return '<div class="share"><span class="k">Share</span>'+
      '<a class="btn sm solid" href="'+li+'" target="_blank" rel="noopener">LinkedIn</a>'+
      '<a class="btn sm" href="'+wa+'" target="_blank" rel="noopener">WhatsApp</a>'+
      '<button class="btn sm" type="button" data-copy="link" data-slug="'+a.slug+'">Copy link</button>'+
      '<button class="btn sm" type="button" data-copy="post" data-slug="'+a.slug+'">Copy LinkedIn post</button></div>';
  }
  function copyText(t,el,label){
    var done=function(){el.textContent="Copied";setTimeout(function(){el.textContent=label},1800)};
    try{navigator.clipboard.writeText(t).then(done,function(){el.textContent="Copy failed"})}catch(x){el.textContent="Copy failed"}
  }
  document.addEventListener("click",function(e){
    var b=e.target.closest("[data-copy]");if(!b)return;
    var a=ARTICLES.find(function(x){return x.slug===b.dataset.slug});if(!a)return;
    var url=SITE+"#"+a.slug;
    if(b.dataset.copy==="link") copyText(url,b,"Copy link");
    else copyText(a.li+" "+url+"\n\n#shipbuilding #Bangladesh #maritime #shipowners",b,"Copy LinkedIn post");
  });

  function show(){
    var id=(location.hash||"#home").slice(1),pageId=id,sheet,toEst=false;
    if(id==="estimate"){id="home";pageId="home";toEst=true}
    var art=ARTICLES.find(function(x){return x.slug===id});
    if(art){pageId="article";renderArticle(art);sheet=order.indexOf("insights")+1}
    else{if(order.indexOf(id)<0){id="home";pageId="home"}sheet=order.indexOf(id)+1}
    pages.forEach(function(p){p.hidden=p.dataset.page!==pageId});
    var navId=art?"insights":id;
    navLinks.forEach(function(a){
      if(a.getAttribute("href")==="#"+navId && !a.classList.contains("cta")) a.setAttribute("aria-current","page");
      else a.removeAttribute("aria-current");
    });
    document.getElementById("sheetNo").textContent=("0"+sheet).slice(-2)+" / 08";
    nav.classList.remove("open");btn.setAttribute("aria-expanded","false");
    if(toEst) setTimeout(scrollToEst,30); else window.scrollTo(0,0);
    yardActive=(pageId==="home");
  }
  function scrollToEst(){var el=document.getElementById("estimator");if(el)el.scrollIntoView({behavior:"smooth",block:"start"})}
  document.addEventListener("click",function(e){
    var a=e.target.closest('a[href="#estimate"]');
    if(a&&location.hash==="#estimate"){e.preventDefault();scrollToEst();nav.classList.remove("open")}
  });
  window.addEventListener("hashchange",show);
  btn.addEventListener("click",function(){var o=nav.classList.toggle("open");btn.setAttribute("aria-expanded",o?"true":"false")});

  /* ---------- Build berth animation ---------- */
  var NS="http://www.w3.org/2000/svg";
  var yardActive=true;
  var framesG=document.getElementById("frames"),blocksG=document.getElementById("blocks");
  var frames=[],blocks=[];
  for(var i=0;i<14;i++){var l=document.createElementNS(NS,"line");var x=15+i*20;l.setAttribute("x1",x);l.setAttribute("x2",x);l.setAttribute("y1",-20);l.setAttribute("y2",72);l.setAttribute("class","y-frame");framesG.appendChild(l);frames.push(l)}
  for(i=0;i<5;i++){var r=document.createElementNS(NS,"rect");r.setAttribute("x",i*60);r.setAttribute("y",-20);r.setAttribute("width",60);r.setAttribute("height",92);r.setAttribute("class","y-blk");r.setAttribute("clip-path","url(#hullClip)");blocksG.appendChild(r);blocks.push(r)}
  var supers=[].slice.call(document.querySelectorAll("#supers > g"));
  var ship=document.getElementById("ship"),keel=document.getElementById("keel"),outline=document.getElementById("outline"),paint=document.getElementById("paint");
  var trolley=document.getElementById("trolley"),hook=document.getElementById("hook");
  var wake=document.getElementById("wake"),wk=[1,2,3].map(function(n){return document.getElementById("wk"+n)});
  var splash=document.getElementById("splash"),sp=[document.getElementById("sp1"),document.getElementById("sp2")];
  var smoke=[0,1,2].map(function(n){return document.getElementById("sm"+n)});
  var stageEls=[].slice.call(document.querySelectorAll("#stages li")),cap=document.getElementById("stageCap");
  var caps=["Keel laid on the berth, frames erected","Hull blocks lifted into place by the gantry","Superstructure fitted, hull painted","Launched into the Karnaphuli","Sea trials, then delivery to the owner"];
  var T=18000;
  function cl(x){return x<0?0:x>1?1:x}
  function seg(t,a,b){return cl((t-a)/(b-a))}
  function ease(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2}
  var lastStage=-1;
  function frame(t,now){
    var tx=60,ty=192,trX=200,hookY=124;
    var kp=seg(t,.03,.07);keel.style.opacity=kp;outline.style.opacity=seg(t,.04,.1);
    frames.forEach(function(f,i){var a=.07+i*.008;f.style.opacity=seg(t,a,a+.015)});
    blocks.forEach(function(b,i){
      var a=.2+i*.048,e=a+.042,p=ease(seg(t,a,e)),off=-(1-p)*150;
      b.setAttribute("transform","translate(0 "+off.toFixed(1)+")");
      b.style.opacity=t>=a?1:0;
      if(t>=a-.008&&t<=e+.004){trX=60+i*60+30;hookY=192-20+off}
    });
    supers.forEach(function(g,i){
      var a=.45+i*.024,e=a+.03,p=ease(seg(t,a,e)),off=-(1-p)*60;
      g.setAttribute("transform","translate(0 "+off.toFixed(1)+")");
      g.style.opacity=t>=a?1:0;
      if(t>=a-.008&&t<=e+.004){trX=60+(+g.dataset.cx);hookY=192-60+off}
    });
    paint.style.opacity=seg(t,.58,.63);
    var lp=ease(seg(t,.64,.74));
    tx=60+380*lp;ty=192+56*ease(seg(lp,.7,1));
    var spP=seg(t,.78,.97);
    if(spP>0){tx=440+640*spP*spP}
    if(t>.72){ty+=Math.sin(now/420)*1.4}
    ship.setAttribute("transform","translate("+tx.toFixed(1)+" "+ty.toFixed(1)+")");
    trolley.setAttribute("x",trX-12);hook.setAttribute("x1",trX);hook.setAttribute("x2",trX);hook.setAttribute("y2",Math.max(112,hookY));
    // splash
    var s=seg(t,.73,.8);splash.style.opacity=s>0&&s<1?1-s:0;
    sp[0].setAttribute("rx",10+s*70);sp[0].setAttribute("ry",2+s*5);
    sp[1].setAttribute("rx",4+s*40);sp[1].setAttribute("ry",1+s*3);
    sp[0].setAttribute("cx",tx+150);sp[1].setAttribute("cx",tx+150);
    // wake
    wake.style.opacity=spP>0&&spP<1?Math.min(1,spP*6):0;
    var sx=tx+4;
    wk[0].setAttribute("d","M"+sx+" 294 Q"+(sx-60)+" 298 "+(sx-150)+" 304");
    wk[1].setAttribute("d","M"+(sx-20)+" 297 Q"+(sx-90)+" 304 "+(sx-200)+" 314");
    wk[2].setAttribute("d","M"+(sx+20)+" 295 L"+(sx-40)+" 296");
    // smoke
    smoke.forEach(function(c,i){
      if(spP>0||(t>.66&&t<.78)){var k=((now/1600)+i/3)%1;c.setAttribute("cy",-48-k*36);c.setAttribute("cx",106-k*30);c.setAttribute("r",3+k*9);c.style.opacity=(1-k)*.9}
      else c.setAttribute("r",0);
    });
    var st=t<.2?0:t<.45?1:t<.635?2:t<.77?3:4;
    if(st!==lastStage){lastStage=st;stageEls.forEach(function(li,i){li.classList.toggle("on",i===st);li.classList.toggle("done",i<st)});cap.textContent=caps[st]}
  }
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var t0=null;
  function loop(now){
    if(t0===null)t0=now;
    if(yardActive&&!document.hidden){frame(((now-t0)%T)/T,now)}
    requestAnimationFrame(loop);
  }
  show();
  if(reduce){frame(.76,0);stageEls.forEach(function(li){li.classList.add("done")})}
  else requestAnimationFrame(loop);

  /* ---------- Newbuild cost estimator ----------
     Indicative parametric model for Bangladeshi yards (2026 USD).
     Steel weight from cubic number L×B×D; power from Admiralty coefficient (or bollard pull);
     hull, machinery and outfit priced per type, then design/class, overhead and series effects. */
  var TYPES={
    tug:{n:"Tug (harbour / coastal)",L:30,LB:3.0,BD:2.2,DT:1.25,Cb:.55,V:12,st:.18,hr:2900,ok:1.0,prop:"azimuth",bp:1},
    ferry:{n:"Passenger ferry",L:45,LB:4.2,BD:2.8,DT:1.6,Cb:.55,V:14,C:330,st:.12,hr:2700,ok:1.3,pax:300,alu:1},
    roro:{n:"Ro-ro / vehicle ferry",L:60,LB:4.5,BD:2.6,DT:1.6,Cb:.65,V:12,C:350,st:.13,hr:2600,ok:1.0,pax:200},
    waterbus:{n:"Water bus / passenger launch",L:22,LB:4.0,BD:2.6,DT:1.7,Cb:.5,V:12,C:300,st:.11,hr:2600,ok:1.2,pax:120,alu:1},
    sar:{n:"Search & rescue / patrol boat",L:16,LB:3.6,BD:2.2,DT:1.7,Cb:.42,V:22,C:170,st:.13,hr:3200,ok:1.4,alu:1},
    workboat:{n:"Workboat / crew boat",L:18,LB:3.3,BD:2.3,DT:1.6,Cb:.5,V:14,C:260,st:.13,hr:2700,ok:.9,alu:1},
    cargo:{n:"General cargo / coaster",L:80,LB:6.2,BD:2.0,DT:1.3,Cb:.75,V:11.5,C:320,st:.09,hr:2800,ok:.9,dwt:1},
    tanker:{n:"Oil / product tanker",L:70,LB:6.0,BD:2.0,DT:1.3,Cb:.78,V:11,C:320,st:.10,hr:2900,ok:1.1,dwt:1},
    dredger:{n:"Cutter suction dredger",L:30,LB:3.0,BD:4.5,DT:1.4,Cb:.8,st:.14,hr:2500,ok:1.6,kwL:55},
    barge:{n:"Deck / hopper barge (towed)",L:50,LB:4.0,BD:4.0,DT:1.3,Cb:.88,st:.11,hr:1900,ok:.2,unp:1},
    pontoon:{n:"Pontoon (heavy-duty / landing)",L:40,LB:3.3,BD:4.5,DT:1.8,Cb:.95,st:.12,hr:1800,ok:.25,unp:1},
    crane:{n:"Crane barge / crane pontoon",L:45,LB:3.0,BD:4.0,DT:1.6,Cb:.9,st:.13,hr:1900,ok:.8,unp:1}
  };
  var SEG=[["Hull steel & fabrication","--s1"],["Machinery & propulsion","--s2"],["Outfitting & systems","--s3"],["Design, class & approvals","--s4"],["Overhead, margin & delivery","--s5"]];
  var MIL=[["Contract signing",.2],["Steel cutting",.2],["Keel laying",.2],["Launching",.2],["Delivery",.2]];
  var $=function(id){return document.getElementById(id)};
  var opts=Object.keys(TYPES).map(function(k){return '<option value="'+k+'">'+esc(TYPES[k].n)+'</option>'}).join("");
  $("e-type").innerHTML=opts;$("q-type").innerHTML=opts;$("q-type").value="ferry";$("q-len").placeholder="e.g. 45";
  function num(id){var v=parseFloat($(id).value);return isFinite(v)&&v>0?v:null}
  function r1(x){return Math.round(x*10)/10}
  function amt(v){if(v>=1e7)return (v/1e6).toFixed(1).replace(/\.0$/,"")+"M";if(v>=1e6)return (v/1e6).toFixed(2).replace(/\.?0+$/,"")+"M";return Math.round(v/1000).toLocaleString("en-US")+"k"}
  function money(v){return "USD "+amt(v)}
  function nice(v){var s=v>=1e7?1e5:v>=1e6?5e4:v>=2e5?1e4:5e3;return Math.round(v/s)*s}
  var last=null;

  function syncFields(){
    var t=TYPES[$("e-type").value];
    document.querySelectorAll("[data-show]").forEach(function(el){
      var k=el.dataset.show,on=true;
      if(k==="pax")on=!!t.pax; else if(k==="dwt")on=!!t.dwt; else if(k==="bp")on=!!t.bp;
      else if(k==="powered")on=!t.unp; else if(k==="speed")on=!t.bp&&!t.kwL;
      el.hidden=!on;
    });
    var alu=$("e-mat").querySelector('[value="alu"]');alu.disabled=!t.alu;if(!t.alu)$("e-mat").value="steel";
  }
  function compute(){
    var key=$("e-type").value,t=TYPES[key];
    var L=num("e-len")||t.L;
    var B=num("e-beam")||r1(L/t.LB),D=num("e-depth")||r1(B/t.BD),T=num("e-draft")||r1(D/t.DT);
    if(T>D)T=r1(D*.85);
    $("e-len").placeholder=t.L;$("e-beam").placeholder=r1(L/t.LB);$("e-depth").placeholder=r1(B/t.BD);$("e-draft").placeholder=r1(D/t.DT);
    var qty=Math.max(1,Math.min(20,Math.round(num("e-qty")||1)));
    var alu=$("e-mat").value==="alu"&&t.alu;
    var cls=$("e-class").value,out=$("e-outfit").value,del=$("e-deliv").value,prop=$("e-prop").value;
    var disp=t.Cb*L*B*T*1.025;
    var steel=t.st*L*B*D, wt=alu?steel*.55:steel;
    var clsF={iacs:1,other:.97,local:.93}[cls],clsP={iacs:.055,other:.04,local:.025}[cls];
    var hull=wt*(alu?11000:t.hr)*clsF;
    // power
    var P=0,V=null,bp=null;
    if(t.unp){P=key==="crane"?Math.round(L*4):0}
    else if(t.bp){bp=num("e-bp")||Math.round(1.8*L);$("e-bp").placeholder=Math.round(1.8*L);P=bp*75}
    else if(t.kwL){P=t.kwL*L}
    else{V=num("e-speed")||t.V;$("e-speed").placeholder=t.V;P=Math.pow(disp,2/3)*Math.pow(V,3)/t.C*1.24}
    var Pest=Math.round(P/10)*10;
    if(!t.unp){$("e-power").placeholder="est. "+Pest.toLocaleString("en-US");var Pu=num("e-power");if(Pu)P=Pu}
    var rate=(300+150*Math.min(1,P/4000))*({shaft:1,azimuth:1.45,jet:1.3}[prop]||1);
    var mach=t.unp?(P?P*300:0):P*rate+15000;
    if($("e-owner").checked&&!t.unp)mach*=.45;
    var outF={basic:.85,std:1,high:1.3}[out];
    var pax=t.pax?(num("e-pax")||t.pax):0; if(t.pax)$("e-pax").placeholder=t.pax;
    var outfit=(t.ok*hull+.12*mach+pax*900)*outF;
    var base=hull+mach+outfit, design=base*clsP;
    var ohP=del==="domestic"?.13:.15, delivery=del==="delivered"?(t.unp?.03*base+40000:.02*base+30000):0;
    var over=(base+design)*ohP+delivery;
    var serF=qty===1?1:qty===2?.97:qty<=4?.94:.91;
    var parts=[hull,mach,outfit,design,over].map(function(x){return x*serF});
    var mid=parts.reduce(function(a,b){return a+b},0);
    var lo=nice(mid*.85),hi=nice(mid*1.2);
    var steelEq=alu?wt/.55:wt;
    var months=Math.max(5,Math.min(30,Math.round(6+steelEq/35+(out==="high"?1:0)+(del!=="domestic"?1:0))));
    var seriesM=months+Math.round(Math.max(1.5,months*.25)*(qty-1));
    last={key:key,t:t,L:L,B:B,D:D,T:T,qty:qty,alu:alu,cls:cls,out:out,del:del,prop:prop,disp:disp,wt:wt,P:P,V:V,bp:bp,pax:pax,parts:parts,mid:mid,lo:lo,hi:hi,months:months,seriesM:seriesM};
    render();
  }
  function render(){
    var r=last;
    $("r-price").textContent=money(r.lo)+" to "+amt(r.hi);
    $("r-sub").innerHTML="Central estimate <b>"+money(nice(r.mid))+"</b> per vessel";
    var ser=$("r-series");ser.hidden=r.qty===1;
    if(r.qty>1)ser.innerHTML="Series of "+r.qty+": <b>"+money(nice(r.lo*r.qty))+" to "+amt(nice(r.hi*r.qty))+"</b> in total, including a series discount";
    var w=[];if(r.L>150)w.push("Vessels over 150 m are reviewed case by case; few Bangladeshi berths take them.");
    if(r.L<10)w.push("Very small craft are often built in GRP; ask us about material options.");
    if(r.T>=r.D)w.push("Draft should be less than depth.");
    $("r-warn").hidden=!w.length;$("r-warn").textContent=w.join(" ");
    var tot=r.mid;
    $("r-bar").innerHTML=r.parts.map(function(v,i){return v>0?'<span style="flex-grow:'+v.toFixed(0)+';background:var('+SEG[i][1]+')" title="'+SEG[i][0]+": "+money(v)+'"></span>':""}).join("");
    $("r-bar").setAttribute("aria-label","Cost breakdown: "+r.parts.map(function(v,i){return SEG[i][0]+" "+Math.round(v/tot*100)+"%"}).join(", "));
    $("r-legend").innerHTML=r.parts.map(function(v,i){return '<li><i style="background:var('+SEG[i][1]+')"></i><span>'+SEG[i][0]+'</span><span class="v">'+money(nice(v))+'</span><span class="p">'+Math.round(v/tot*100)+'%</span></li>'}).join("");
    $("k-steel").textContent=Math.round(r.wt).toLocaleString("en-US")+" t"+(r.alu?" Al":"");
    $("k-disp").textContent=Math.round(r.disp).toLocaleString("en-US")+" t";
    $("k-power").textContent=r.P?(Math.round(r.P/10)*10).toLocaleString("en-US")+" kW":"Unpowered";
    $("k-time").textContent=r.months+" months"+(r.qty>1?" · "+r.seriesM+" for series":"");
    $("r-pay").innerHTML=MIL.map(function(m){return "<tr><td>"+m[0]+" · "+Math.round(m[1]*100)+"%</td><td>"+money(nice(r.mid*m[1]))+"</td></tr>"}).join("");
  }
  function summary(){
    var r=last,lines=[
      "NEWBUILD ESTIMATE REQUEST",
      "Vessel: "+r.t.n+(r.qty>1?" × "+r.qty:""),
      "Dimensions: L "+r.L+" m, B "+r.B+" m, D "+r.D+" m, T "+r.T+" m",
      r.t.bp?"Bollard pull: "+r.bp+" t":(r.V?"Service speed: "+r.V+" kn":""),
      r.P?"Installed power: "+Math.round(r.P)+" kW ("+$("e-prop").selectedOptions[0].text+")":"Unpowered",
      r.pax?"Passengers: "+r.pax:"",
      r.t.dwt&&num("e-dwt")?"Deadweight: "+num("e-dwt")+" DWT":"",
      "Hull material: "+(r.alu?"Aluminium":"Steel"),
      "Class: "+$("e-class").selectedOptions[0].text,
      "Outfit: "+$("e-outfit").selectedOptions[0].text,
      "Delivery: "+$("e-deliv").selectedOptions[0].text+($("e-flag").value?" · "+$("e-flag").value:""),
      $("e-date").value?"Target delivery: "+$("e-date").value:"",
      $("e-owner").checked?"Owner-supplied main engines":"",
      "",
      "Indicative price per vessel: "+money(r.lo)+" to "+money(r.hi)+" (central "+money(nice(r.mid))+")",
      r.qty>1?"Series total: "+money(nice(r.lo*r.qty))+" to "+money(nice(r.hi*r.qty)):"",
      "Indicative build time: "+r.months+" months"+(r.qty>1?", series "+r.seriesM+" months":"")
    ];
    return lines.filter(function(x,i){return x!==""||i===13}).join("\n");
  }
  var form2=$("estForm");
  form2.addEventListener("input",function(e){if(e.target.id==="e-type"){["e-beam","e-depth","e-draft","e-speed","e-power","e-bp","e-pax"].forEach(function(id){$(id).value=""});syncFields()}if(e.target.id==="e-len"){["e-beam","e-depth","e-draft"].forEach(function(id){$(id).value=""})}compute()});
  form2.addEventListener("change",function(e){if(e.target.id==="e-type"||e.target.id==="e-mat")syncFields();compute()});
  $("quick").addEventListener("submit",function(e){
    e.preventDefault();
    $("e-type").value=$("q-type").value;["e-beam","e-depth","e-draft","e-speed","e-power","e-bp","e-pax"].forEach(function(id){$(id).value=""});
    $("e-len").value=$("q-len").value;$("e-qty").value=$("q-qty").value||1;
    syncFields();compute();scrollToEst();
  });
  $("r-quote").addEventListener("click",function(){
    $("f-type").value="Newbuild in Bangladesh";
    $("f-vessel").value=last.t.n+", "+last.L+" m"+(last.qty>1?" × "+last.qty:"");
    $("f-msg").value=summary()+"\n\nAnything else we should know:\n";
    location.hash="#contact";
    setTimeout(function(){$("f-name").focus({preventScroll:true})},200);
  });
  $("r-copy").addEventListener("click",function(){copyText(summary(),$("r-copy"),"Copy summary")});
  $("e-type").value="ferry";syncFields();compute();

  /* ---------- Enquiry form ---------- */
  var form=document.getElementById("enq"),out=document.getElementById("out"),txt=document.getElementById("outText");
  var err=document.getElementById("f-err"),mail=document.getElementById("mailLink"),copy=document.getElementById("copyBtn");
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var v=function(id){return document.getElementById(id).value.trim()};
    var email=v("f-email");
    if(!v("f-name")||!/^\S+@\S+\.\S+$/.test(email)){err.hidden=false;return}
    err.hidden=true;
    var body="Name: "+v("f-name")+"\nCompany: "+(v("f-company")||"-")+"\nEmail: "+email+"\nCountry: "+(v("f-country")||"-")+"\nEnquiry: "+v("f-type")+"\nVessel: "+(v("f-vessel")||"-")+"\n\n"+(v("f-msg")||"");
    txt.textContent=body;
    mail.href="mailto:sabbab@sst-tsdhel.com?subject="+encodeURIComponent("Enquiry: "+v("f-type"))+"&body="+encodeURIComponent(body);
    out.hidden=false;out.scrollIntoView({block:"nearest"});
  });
  copy.addEventListener("click",function(){
    var fallback=function(){var r=document.createRange();r.selectNodeContents(txt);var s=getSelection();s.removeAllRanges();s.addRange(r);copy.textContent="Text selected"};
    try{navigator.clipboard.writeText(txt.textContent).then(function(){copy.textContent="Copied"},fallback)}catch(x){fallback()}
  });
})();
