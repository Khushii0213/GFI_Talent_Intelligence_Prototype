"use client";
import {useMemo,useState} from "react";
import resumes from "@/data/resumes.json";
import {classify,evaluate, type Candidate, type Role} from "@/lib/scoring";
const seed=(resumes as Candidate[]).map(r=>({...r,source:`/resumes/${encodeURIComponent(r.filename)}`}));
type Result={candidate:Candidate;result:ReturnType<typeof classify>};
export default function Home(){
 const [items,setItems]=useState<Result[]>(()=>seed.map(candidate=>({candidate,result:classify(candidate)})));
 const [role,setRole]=useState<Role>("LCA"),[query,setQuery]=useState(""),[sort,setSort]=useState("score"),[filter,setFilter]=useState("all");
 const [selected,setSelected]=useState<string|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const ranked=useMemo(()=>{
  return items.filter(x=>{
   const s=role==="LCA"?x.result.lca:x.result.ux;
   const q=query.toLowerCase();
   const matches=!q||x.candidate.id.toLowerCase().includes(q)||x.candidate.text.toLowerCase().includes(q);
   const filterMatch=filter==="all"||(filter==="strong"&&s.score>=55)||(filter==="potential"&&s.score>=35&&s.score<55)||(filter==="weak"&&s.score<35)||(filter==="errors"&&x.candidate.status==="empty");
   return matches&&filterMatch;
  }).sort((a,b)=>{
   const aa=role==="LCA"?a.result.lca.score:a.result.ux.score,bb=role==="LCA"?b.result.lca.score:b.result.ux.score;
   return sort==="name"?a.candidate.id.localeCompare(b.candidate.id):bb-aa;
  });
 },[items,role,query,sort,filter]);
 const active=items.find(x=>x.candidate.id===selected);
 const current=(x:Result)=>role==="LCA"?x.result.lca:x.result.ux;
 async function upload(file?:File){
  if(!file)return;
  setBusy(true);setMessage("");
  const fd=new FormData();fd.append("file",file);
  try{
   const res=await fetch("/api/analyze",{method:"POST",body:fd});const data=await res.json();
   if(!res.ok)throw new Error(data.error||"Upload failed");
   setItems(prev=>[{candidate:data.candidate,result:data.result},...prev]);setSelected(data.candidate.id);
   setMessage(`Added ${file.name} and ranked it for both roles.`);
  }catch(e){setMessage(e instanceof Error?e.message:"Upload failed.");}
  finally{setBusy(false);}
 }
 const lcaStrong=items.filter(x=>x.result.lca.score>=55).length,uxStrong=items.filter(x=>x.result.ux.score>=55).length;
 return <main className="shell">
  <header className="top"><div><div className="eyebrow">GROWTH FOR IMPACT · TALENT INTELLIGENCE</div><h1>Resume screening workspace</h1><p>Evidence-led candidate matching for two open roles.</p></div><div className="topmark">GFI<span>✳</span></div></header>
  <section className="stats">
   <div className="stat"><span>Resumes loaded</span><b>{items.length}</b><small>47 source files · {items.filter(x=>x.candidate.status==="empty").length} extraction issue</small></div>
   <div className="stat"><span>LCA strong matches</span><b>{lcaStrong}</b><small>Score ≥ 55 · review recommended</small></div>
   <div className="stat"><span>UI/UX strong matches</span><b>{uxStrong}</b><small>Score ≥ 55 · review recommended</small></div>
  </section>
  <section className="roleTabs">
   <button className={role==="LCA"?"active":""} onClick={()=>{setRole("LCA");setSelected(null)}}><span>01</span><div><b>LCA Consultant</b><small>Life Cycle Assessment</small></div></button>
   <button className={role==="UX"?"active":""} onClick={()=>{setRole("UX");setSelected(null)}}><span>02</span><div><b>UI/UX Design Intern</b><small>Product & interface design</small></div></button>
  </section>
  <section className="workspace">
   <div className="listPanel">
    <div className="panelHead"><div><h2>Candidate ranking</h2><p>{ranked.length} candidates · sorted by {sort==="score"?"match score":"candidate ID"}</p></div><label className="upload">＋ Add resume<input type="file" accept="*/*" disabled={busy} onChange={e=>upload(e.target.files?.[0])}/></label></div>
    {message&&<div className="message">{message}</div>}
    <div className="filters"><input placeholder="Search candidate or resume text…" value={query} onChange={e=>setQuery(e.target.value)}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All matches</option><option value="strong">Strong match</option><option value="potential">Potential match</option><option value="weak">Weak / uncertain</option><option value="errors">Extraction errors</option></select><select value={sort} onChange={e=>setSort(e.target.value)}><option value="score">Highest score</option><option value="name">Candidate ID</option></select></div>
    <div className="candidateList">{ranked.map((x,i)=>{const s=current(x);return <button key={x.candidate.id} className={`candidate ${selected===x.candidate.id?"chosen":""}`} onClick={()=>setSelected(x.candidate.id)}><span className="rank">{i+1}</span><span className="candname"><b>{x.candidate.id}</b><small>{x.candidate.filename}</small><em>{s.classification}</em></span><span className="score"><b>{s.score}</b><small>/100</small></span></button>})}</div>
   </div>
   <aside className="detailPanel">
    {active?<><div className="detailTop"><div><div className="eyebrow">CANDIDATE DETAIL</div><h2>{active.candidate.id}</h2><p>{active.candidate.filename}</p></div><div className="bigScore">{current(active).score}<small>/100</small></div></div>
     <div className="classification">{active.result.label} <span>·</span> {current(active).classification}</div>
     <h3>Score breakdown</h3>{current(active).buckets.map(b=><div className="bucket" key={b.name}><div><b>{b.name}</b><span>{b.score}/100 · weight {b.weight}%</span></div><div className="bar"><i style={{width:`${b.score}%`}}/></div></div>)}
     <h3>Matched evidence</h3><div className="chips">{current(active).evidence.length?current(active).evidence.map((e,i)=><span key={`${e.term}-${i}`}>{e.term}</span>):<p className="muted">No configured keyword evidence found. Manual review required.</p>}</div>
     <h3>Extracted resume text</h3><pre className="resumeText">{active.candidate.text||"No readable text extracted. Original document should be checked."}</pre>
     {active.candidate.source&&<a className="sourceLink" href={active.candidate.source} target="_blank">Open original resume ↗</a>}
    </>:<div className="emptyDetail"><div className="emptyIcon">↖</div><h2>Select a candidate</h2><p>Inspect the evidence, scoring breakdown and extracted resume text.</p></div>}
   </aside>
  </section>
  <section className="method"><div><div className="eyebrow">TRANSPARENT BY DESIGN</div><h2>How matching works</h2><p>Deterministic weighted keyword evidence across role-specific categories. Each matched term is visible to the reviewer; scores are triage aids, not hiring decisions.</p></div><div className="methodNote"><b>Important JD discrepancy</b><p>The assignment PDF says 4–6 years for LCA; linked JD1 says 2–3 years. This prototype does not silently resolve that conflict or auto-reject candidates based on tenure.</p><a href="https://tally.so/r/9q5plp" target="_blank">View JD1 ↗</a><a href="https://tally.so/r/0QovpQ" target="_blank">View JD2 ↗</a></div></section>
  <footer>GFI Talent Intelligence · Prototype · Human review required · No demographic or protected-attribute scoring</footer>
 </main>
}