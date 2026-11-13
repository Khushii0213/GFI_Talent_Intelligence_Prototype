export type Role = "LCA" | "UX";
export type Candidate = {id:string; filename:string; text:string; status?:string; source?:string};
type Bucket = {name:string; weight:number; terms:string[]};
const config:Record<Role,{title:string;buckets:Bucket[]}> = {
 LCA:{title:"LCA Consultant",buckets:[
  {name:"Relevant experience",weight:25,terms:["life cycle assessment","lca consultant","lca analyst","lca projects","life cycle analysis","product carbon footprint","pcf"]},
  {name:"Technical skills",weight:25,terms:["lci","life cycle inventory","ecoinvent","openlca","simaPro","gabi","gaBi","iso 14040","iso 14044","impact assessment","system boundary","functional unit","allocation","inventory modelling"]},
  {name:"Relevant projects",weight:20,terms:["epd","environmental product declaration","cradle-to-gate","cradle to gate","carbon footprint","ghg accounting","scope 1","scope 2","scope 3","bom","bill of materials"]},
  {name:"Domain knowledge",weight:15,terms:["sustainability","environmental compliance","decarbonisation","decarbonization","circular economy","esg","emissions","environmental impact","supply chain"]},
  {name:"Education",weight:10,terms:["environmental engineering","environmental science","chemical engineering","sustainability","life sciences","mechanical engineering"]},
  {name:"Tools",weight:5,terms:["openlca","simaPro","gabi","ecoinvent","brightway","sphera"]}
 ]},
 UX:{title:"UI/UX Design Intern",buckets:[
  {name:"Relevant experience",weight:15,terms:["ui/ux designer","ux/ui designer","product designer","ui designer","ux designer","design intern","product design intern"]},
  {name:"Technical skills",weight:25,terms:["figma","wireframes","wireframing","prototyping","high-fidelity","user research","usability testing","user flows","design system","auto layout","heuristic evaluation","human-centered","human centred"]},
  {name:"Relevant projects",weight:20,terms:["website","job board","mobile app","dashboard","web application","landing page","case study","prototype","redesign","responsive design"]},
  {name:"Domain knowledge",weight:15,terms:["user psychology","user behavior","user behaviour","accessibility","information architecture","visual hierarchy","interaction design","user-centered","user centred","persona"]},
  {name:"Education",weight:10,terms:["design","visual communication","interaction design","human computer interaction","graphic design","ui ux"]},
  {name:"Tools",weight:15,terms:["figma","sketch","adobe xd","penpot","illustrator","photoshop","blender","spline"]}
 ]}
};
const norm=(s:string)=>s.toLowerCase().replace(/\s+/g," ");
function scoreBucket(text:string,b:Bucket){
 const t=norm(text);
 const matched = Array.from(new Set(b.terms.filter(term => t.includes(norm(term)))));
 const raw=Math.min(1,matched.length/Math.max(3,Math.ceil(b.terms.length*0.32)));
 return {name:b.name,weight:b.weight,score:Math.round(raw*100),matched};
}
export function evaluate(candidate:Candidate,role:Role){
 const cfg=config[role];
 const buckets=cfg.buckets.map(b=>scoreBucket(candidate.text,b));
 const score=Math.round(buckets.reduce((s,b)=>s+b.score*b.weight/100,0));
 const evidence=buckets.flatMap(b=>b.matched.map(term=>({bucket:b.name,term})));
 return {role,title:cfg.title,score,buckets,evidence,classification:score>=55?"Strong match":score>=35?"Potential match":"Weak/uncertain match"};
}
export function classify(candidate:Candidate){
 const lca=evaluate(candidate,"LCA"),ux=evaluate(candidate,"UX");
 let label="Neither / uncertain";
 if(lca.score>=55 && ux.score>=55) label="Both";
 else if(lca.score>=55) label="LCA";
 else if(ux.score>=55) label="UI/UX";
 else if(lca.score>=35 || ux.score>=35) label="Potential / review";
 return {label,lca,ux};
}
export const ROLE_CONFIG=config;