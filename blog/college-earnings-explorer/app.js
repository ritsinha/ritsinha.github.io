'use strict';
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const num=n=>n.toLocaleString('en-US');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let records=[],filtered=[],selected=new Set(),page=0;
const selectedMajors=new Set(['4510']),selectedColleges=new Set();
let majorOptions=[],collegeOptions=[];
const pageSize=35;
const majorTitles={'4510':'Political science','5401':'History','4506':'Economics','2701':'Mathematics','2705':'Statistics'};
const stateNames={AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',DC:'District of Columbia',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',PR:'Puerto Rico',VI:'U.S. Virgin Islands',GU:'Guam',AS:'American Samoa',MP:'Northern Mariana Islands'};
function gap(r){return r.e-r.b;}
function gapText(r){let n=gap(r);return (n>=0?'+':'−')+money(Math.abs(n));}
function openDialog(id){$(id).showModal();}
$('about').onclick=$('learn').onclick=()=>openDialog('about-dialog');
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){let r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));

function collegeKey(r){return String(r.o);}
function optionList(kind){return kind==='major'?majorOptions:collegeOptions;}
function selectedSet(kind){return kind==='major'?selectedMajors:selectedColleges;}
function optionLabel(kind,item){return kind==='major'?item.label:`${item.label} · ${stateNames[item.state]||item.state}`;}
function optionMatches(kind,item,query){return optionLabel(kind,item).toLowerCase().includes(query);}
function renderMulti(kind){
 const input=$(kind+'-search'),options=$(kind+'-options'),chips=$(kind+'-chips'),chosen=selectedSet(kind),query=input.value.trim().toLowerCase();
 const all=optionList(kind),chosenItems=all.filter(item=>chosen.has(item.value));
 chips.innerHTML=chosenItems.map(item=>`<button class="multi-chip" type="button" data-remove-${kind}="${esc(item.value)}" aria-label="Remove ${esc(optionLabel(kind,item))}">${esc(kind==='major'?item.label:item.label)} <span aria-hidden="true">×</span></button>`).join('');
 chips.querySelectorAll(`[data-remove-${kind}]`).forEach(button=>button.onclick=()=>{chosen.delete(button.dataset[`remove${kind[0].toUpperCase()+kind.slice(1)}`]);renderMulti(kind);filterData();});
 const matches=all.filter(item=>chosen.has(item.value)||optionMatches(kind,item,query)).sort((a,b)=>(query?'':Number(chosen.has(b.value))-Number(chosen.has(a.value))||optionLabel(kind,a).localeCompare(optionLabel(kind,b)))||(query?optionLabel(kind,a).localeCompare(optionLabel(kind,b)):0)).slice(0,80);
 options.innerHTML=matches.length?matches.map(item=>`<button type="button" class="multi-option ${chosen.has(item.value)?'chosen':''}" role="option" aria-selected="${chosen.has(item.value)}" data-option-${kind}="${esc(item.value)}"><span class="option-check" aria-hidden="true">${chosen.has(item.value)?'✓':''}</span><span>${esc(optionLabel(kind,item))}</span></button>`).join(''):`<p class="multi-empty">No matches</p>`;
 options.querySelectorAll(`[data-option-${kind}]`).forEach(button=>button.onclick=()=>{const value=button.dataset[`option${kind[0].toUpperCase()+kind.slice(1)}`];if(chosen.has(value))chosen.delete(value);else chosen.add(value);input.value='';renderMulti(kind);filterData();input.focus();});
 document.querySelectorAll('[data-major]').forEach(button=>button.classList.toggle('active',selectedMajors.has(button.dataset.major)));
}
function closeMulti(kind){$(kind+'-options').hidden=true;$(kind+'-search').setAttribute('aria-expanded','false');}
function openMulti(kind){renderMulti(kind);$(kind+'-options').hidden=false;$(kind+'-search').setAttribute('aria-expanded','true');}
function setupMulti(kind){
 const input=$(kind+'-search'),toggle=document.querySelector(`.multi-select[data-kind="${kind}"] .multi-toggle`);
 input.addEventListener('focus',()=>openMulti(kind));
 input.addEventListener('input',()=>openMulti(kind));
 input.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();openMulti(kind);$(kind+'-options').querySelector('.multi-option')?.focus();}if(event.key==='Escape')closeMulti(kind);});
 toggle.onclick=()=>$(kind+'-options').hidden?openMulti(kind):closeMulti(kind);
}
document.addEventListener('click',event=>document.querySelectorAll('.multi-select').forEach(box=>{if(!box.contains(event.target))closeMulti(box.dataset.kind);}));
function filterData(){
 const state=$('state').value,degree=$('degree').value,cohort=Number($('cohort').value);
 filtered=records.filter(r=>(!selectedMajors.size||selectedMajors.has(r.c))&&(!selectedColleges.size||selectedColleges.has(collegeKey(r)))&&(!state||r.s===state)&&(!degree||r.d===degree)&&r.n>=cohort);
 const sort=$('sort').value;
 filtered.sort((a,b)=>(sort==='earn-asc'?a.e-b.e:sort==='name'?a.name.localeCompare(b.name):sort==='cohort'?b.n-a.n:sort==='premium'?gap(b)-gap(a):b.e-a.e)||a.name.localeCompare(b.name));
 page=0;render();
}
function render(){
 const chosenMajors=[...selectedMajors];
 $('heading').textContent=chosenMajors.length===1?(majorTitles[chosenMajors[0]]||records.find(r=>r.c===chosenMajors[0])?.m||'Programs'):chosenMajors.length?`${chosenMajors.length} selected majors`:'All majors';
 const degree=$('degree').value;
 $('subheading').textContent=(degree==='Bachelor'?'Bachelor’s programs':degree==='Associate'?'Associate programs':'Associate and bachelor’s programs')+($('state').value?' in '+(stateNames[$('state').value]||$('state').value):' across the United States');
 document.querySelectorAll('[data-major]').forEach(b=>b.classList.toggle('active',selectedMajors.has(b.dataset.major)));
 $('count').textContent=num(filtered.length);
 const earnings=filtered.map(r=>r.e).sort((a,b)=>a-b),middle=Math.floor(earnings.length/2);
 $('median').textContent=earnings.length?money(earnings.length%2?earnings[middle]:(earnings[middle-1]+earnings[middle])/2):'—';
 $('range').textContent=earnings.length?money(earnings[0])+' – '+money(earnings.at(-1)):'—';
 $('result-label').textContent=num(new Set(filtered.map(r=>r.o)).size)+' colleges · '+num(filtered.length)+' reported programs';
 $('download').disabled=!filtered.length;
 renderRows();
}
function renderRows(){
 const max=Math.max(...filtered.map(r=>r.e),1),slice=filtered.slice(page*pageSize,(page+1)*pageSize),allMajors=selectedMajors.size!==1;
 $('rows').innerHTML=slice.length?slice.map(r=>`<tr class="${selected.has(r.id)?'selected':''}"><td><input type="checkbox" data-compare="${r.id}" ${selected.has(r.id)?'checked':''} aria-label="Compare ${esc(r.name)}, ${esc(r.m)}, ${r.d}"></td><td><span class="college-name">${esc(r.name)}</span><span class="college-meta">${esc(stateNames[r.s]||r.s)} · ${r.d==='Bachelor'?'Bachelor’s':'Associate'}${allMajors?' · '+esc(r.m):''}</span></td><td class="number earnings">${money(r.e)} <span class="gap ${gap(r)<0?'negative':''}" title="${esc(r.basis)}: ${money(r.b)}">${gapText(r)} vs. HS</span><span class="cohort-size" title="Number of working, non-enrolled federal-aid recipients in the earnings cohort">Based on <b>${num(r.n)}</b> graduates</span><div class="bar" aria-hidden="true"><span style="width:${r.e/max*100}%"></span></div></td></tr>`).join(''):'<tr><td colspan="3" class="empty">No reported programs match these filters.<br>Try another major, a broader college name, or a smaller minimum cohort.</td></tr>';
 const pages=Math.ceil(filtered.length/pageSize);
 $('page-label').textContent=filtered.length?`${num(page*pageSize+1)}–${num(Math.min((page+1)*pageSize,filtered.length))} of ${num(filtered.length)}`:'0 results';
 $('prev').disabled=page===0;$('next').disabled=page+1>=pages;
 $('rows').querySelectorAll('[data-compare]').forEach(c=>c.addEventListener('change',()=>toggle(Number(c.dataset.compare),c)));
}
function toggle(id,checkbox){
 if(selected.has(id))selected.delete(id);
 else if(selected.size<5)selected.add(id);
 else {if(checkbox)checkbox.checked=false;toast('You can compare up to five programs at a time.');return;}
 updateTray();renderRows();
}
function toast(message){$('toast').textContent=message;$('toast').hidden=false;setTimeout(()=>$('toast').hidden=true,3500);}
function updateTray(){
 $('compare-tray').hidden=!selected.size;$('compare-count').textContent=selected.size+' program'+(selected.size===1?'':'s')+' selected';
 $('show-compare').disabled=selected.size<2;
}
function renderComparison(){
 const chosen=[...selected].map(id=>records[id]),max=Math.max(...chosen.map(r=>r.e),1);
 $('comparison').innerHTML=chosen.map(r=>`<article class="compare-card"><span class="eyebrow">${esc(r.s)}</span><h3>${esc(r.name)}</h3><span class="college-meta">${esc(r.m)} · ${r.d==='Bachelor'?'Bachelor’s':'Associate'}</span><strong>${money(r.e)}</strong><span class="college-meta">Median annual earnings</span><span class="cohort-size">Based on <b>${num(r.n)}</b> graduates</span><div class="bar" aria-hidden="true"><span style="width:${r.e/max*100}%"></span></div><dl><dt>HS benchmark</dt><dd>${money(r.b)}</dd><dt>Benchmark basis</dt><dd>${esc(r.basis)}</dd><dt>Gap vs. benchmark</dt><dd>${gapText(r)}</dd><dt>CIP category</dt><dd>${r.c.slice(0,2)}.${r.c.slice(2)}</dd></dl><button class="remove" data-remove="${r.id}">Remove program</button></article>`).join('');
 $('comparison').querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{toggle(Number(b.dataset.remove));if(selected.size)renderComparison();else $('compare-dialog').close();});
}
$('show-compare').onclick=()=>{renderComparison();openDialog('compare-dialog');};
$('clear-compare').onclick=()=>{selected.clear();updateTray();renderRows();};
['state','degree','cohort','sort'].forEach(id=>$(id).addEventListener('change',filterData));
document.querySelectorAll('[data-major]').forEach(b=>b.onclick=()=>{if(selectedMajors.has(b.dataset.major))selectedMajors.delete(b.dataset.major);else selectedMajors.add(b.dataset.major);$('degree').value='Bachelor';renderMulti('major');filterData();});
$('reset').onclick=()=>{selectedMajors.clear();selectedMajors.add('4510');selectedColleges.clear();$('state').value='';$('degree').value='Bachelor';$('cohort').value='0';$('sort').value='earn-desc';$('major-search').value='';$('college-search').value='';renderMulti('major');renderMulti('college');filterData();};
$('prev').onclick=()=>{page--;renderRows();};$('next').onclick=()=>{page++;renderRows();};
$('download').onclick=()=>{
 const cols=['Institution','State','CIP4','Major','Credential','Median earnings 4 years after completion (2024 USD)','Completers in earnings cohort','HS earnings benchmark (2024 USD)','Gap vs HS benchmark (2024 USD)','Benchmark basis'];
 const quote=v=>'"'+String(v).replace(/"/g,'""')+'"';
 const csv='\uFEFF'+[cols,...filtered.map(r=>[r.name,r.s,r.c,r.m,r.d,r.e,r.n,r.b,gap(r),r.basis])].map(row=>row.map(quote).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'})),a=document.createElement('a');a.href=url;a.download='college-earnings-'+(selectedMajors.size===1?[...selectedMajors][0]:'selected-majors')+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
async function init(){
 try{
  const response=await fetch('data.json');if(!response.ok)throw Error('Data could not be loaded.');
  const raw=await response.json();
  records=raw.map((r,id)=>({id,o:r[0],name:r[1],s:r[2],c:r[3],m:r[4],d:r[5],e:r[6],n:r[7],b:r[8],basis:r[9]}));
  majorOptions=[...new Map(records.map(r=>[r.c,{value:r.c,label:r.m}])).values()].sort((a,b)=>a.label.localeCompare(b.label));
  collegeOptions=[...new Map(records.map(r=>[collegeKey(r),{value:collegeKey(r),label:r.name,state:r.s}])).values()].sort((a,b)=>a.label.localeCompare(b.label)||a.state.localeCompare(b.state));
  const states=[...new Set(records.map(r=>r.s))].sort((a,b)=>(stateNames[a]||a).localeCompare(stateNames[b]||b));
  $('state').innerHTML='<option value="">All states</option>'+states.map(s=>`<option value="${esc(s)}">${esc(stateNames[s]||s)}</option>`).join('');
  setupMulti('major');setupMulti('college');renderMulti('major');renderMulti('college');filterData();
 }catch(e){console.error('Explorer initialization failed:',e);$('rows').innerHTML='<tr><td colspan="4" class="empty">The dataset could not be loaded. Please reload this page to try again.</td></tr>';$('result-label').textContent='Data unavailable';}
}
init();
