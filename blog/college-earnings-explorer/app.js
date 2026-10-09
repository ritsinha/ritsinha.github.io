'use strict';
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const num=n=>n.toLocaleString('en-US');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let records=[],filtered=[],selected=new Set(),page=0;
const pageSize=35;
const majorTitles={'4510':'Political science','5401':'History','4506':'Economics','2701':'Mathematics','2705':'Statistics'};
const stateNames={AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',DC:'District of Columbia',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',PR:'Puerto Rico',VI:'U.S. Virgin Islands',GU:'Guam',AS:'American Samoa',MP:'Northern Mariana Islands'};
function gap(r){return r.e-r.b;}
function gapText(r){let n=gap(r);return (n>=0?'+':'−')+money(Math.abs(n));}
function openDialog(id){$(id).showModal();}
$('about').onclick=$('learn').onclick=()=>openDialog('about-dialog');
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){let r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
function filterData(){
 const major=$('major').value,state=$('state').value,degree=$('degree').value,cohort=Number($('cohort').value);
 const words=$('search').value.trim().toLowerCase().split(/\s+/).filter(Boolean);
 filtered=records.filter(r=>(!major||r.c===major)&&(!state||r.s===state)&&(!degree||r.d===degree)&&r.n>=cohort&&words.every(w=>r.name.toLowerCase().includes(w)));
 const sort=$('sort').value;
 filtered.sort((a,b)=>(sort==='earn-asc'?a.e-b.e:sort==='name'?a.name.localeCompare(b.name):sort==='cohort'?b.n-a.n:sort==='premium'?gap(b)-gap(a):b.e-a.e)||a.name.localeCompare(b.name));
 page=0;render();
}
function render(){
 const major=$('major').value;
 $('heading').textContent=major?(majorTitles[major]||records.find(r=>r.c===major)?.m||'Programs'):'All majors';
 const degree=$('degree').value;
 $('subheading').textContent=(degree==='Bachelor'?'Bachelor’s programs':degree==='Associate'?'Associate programs':'Associate and bachelor’s programs')+($('state').value?' in '+(stateNames[$('state').value]||$('state').value):' across the United States');
 document.querySelectorAll('[data-major]').forEach(b=>b.classList.toggle('active',b.dataset.major===major));
 $('count').textContent=num(filtered.length);
 const earnings=filtered.map(r=>r.e).sort((a,b)=>a-b),middle=Math.floor(earnings.length/2);
 $('median').textContent=earnings.length?money(earnings.length%2?earnings[middle]:(earnings[middle-1]+earnings[middle])/2):'—';
 $('range').textContent=earnings.length?money(earnings[0])+' – '+money(earnings.at(-1)):'—';
 $('result-label').textContent=num(new Set(filtered.map(r=>r.o)).size)+' colleges · '+num(filtered.length)+' reported programs';
 $('download').disabled=!filtered.length;
 renderRows();
}
function renderRows(){
 const max=Math.max(...filtered.map(r=>r.e),1),slice=filtered.slice(page*pageSize,(page+1)*pageSize),allMajors=!$('major').value;
 $('rows').innerHTML=slice.length?slice.map(r=>`<tr class="${selected.has(r.id)?'selected':''}"><td><input type="checkbox" data-compare="${r.id}" ${selected.has(r.id)?'checked':''} aria-label="Compare ${esc(r.name)}, ${esc(r.m)}, ${r.d}"></td><td><span class="college-name">${esc(r.name)}</span><span class="college-meta">${esc(stateNames[r.s]||r.s)} · ${r.d==='Bachelor'?'Bachelor’s':'Associate'}${allMajors?' · '+esc(r.m):''}</span></td><td class="number earnings">${money(r.e)}<span class="cohort-size" title="Number of working, non-enrolled federal-aid recipients in the earnings cohort">Based on <b>${num(r.n)}</b> graduates</span><div class="bar" aria-hidden="true"><span style="width:${r.e/max*100}%"></span></div></td><td class="number optional gap ${gap(r)<0?'negative':''}" title="${esc(r.basis)}: ${money(r.b)}">${gapText(r)}</td></tr>`).join(''):'<tr><td colspan="4" class="empty">No reported programs match these filters.<br>Try another major, a broader college name, or a smaller minimum cohort.</td></tr>';
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
['major','state','degree','cohort','sort'].forEach(id=>$(id).addEventListener('change',filterData));
$('search').addEventListener('input',filterData);
document.querySelectorAll('[data-major]').forEach(b=>b.onclick=()=>{$('major').value=b.dataset.major;$('degree').value='Bachelor';filterData();});
$('reset').onclick=()=>{$('major').value='4510';$('state').value='';$('degree').value='Bachelor';$('cohort').value='0';$('search').value='';$('sort').value='earn-desc';filterData();};
$('prev').onclick=()=>{page--;renderRows();};$('next').onclick=()=>{page++;renderRows();};
$('download').onclick=()=>{
 const cols=['Institution','State','CIP4','Major','Credential','Median earnings 4 years after completion (2024 USD)','Completers in earnings cohort','HS earnings benchmark (2024 USD)','Gap vs HS benchmark (2024 USD)','Benchmark basis'];
 const quote=v=>'"'+String(v).replace(/"/g,'""')+'"';
 const csv='\uFEFF'+[cols,...filtered.map(r=>[r.name,r.s,r.c,r.m,r.d,r.e,r.n,r.b,gap(r),r.basis])].map(row=>row.map(quote).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'})),a=document.createElement('a');a.href=url;a.download='college-earnings-'+($('major').value||'all-majors')+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
async function init(){
 try{
  const response=await fetch('data.json');if(!response.ok)throw Error('Data could not be loaded.');
  const raw=await response.json();
  records=raw.map((r,id)=>({id,o:r[0],name:r[1],s:r[2],c:r[3],m:r[4],d:r[5],e:r[6],n:r[7],b:r[8],basis:r[9]}));
  const majors=[...new Map(records.map(r=>[r.c,r.m])).entries()].sort((a,b)=>a[1].localeCompare(b[1]));
  $('major').innerHTML='<option value="">All majors</option>'+majors.map(([c,m])=>`<option value="${c}">${esc(m)}</option>`).join('');
  $('major').value='4510';$('major').disabled=false;
  const states=[...new Set(records.map(r=>r.s))].sort((a,b)=>(stateNames[a]||a).localeCompare(stateNames[b]||b));
  $('state').innerHTML='<option value="">All states</option>'+states.map(s=>`<option value="${esc(s)}">${esc(stateNames[s]||s)}</option>`).join('');
  filterData();
 }catch(e){$('rows').innerHTML='<tr><td colspan="4" class="empty">The dataset could not be loaded. Please reload this page to try again.</td></tr>';$('result-label').textContent='Data unavailable';}
}
init();
