import {NextRequest,NextResponse} from "next/server";
import mammoth from "mammoth";
import pdf from "pdf-parse";
import {classify} from "@/lib/scoring";
export const runtime="nodejs";
export const maxDuration=30;
export async function POST(req:NextRequest){
 try{
  const form=await req.formData();
  const file=form.get("file");
  if(!(file instanceof File)) return NextResponse.json({error:"Upload a PDF or DOCX resume."},{status:400});
  const name=file.name.toLowerCase();
  const buffer=Buffer.from(await file.arrayBuffer());
  let text="";
  if(name.endsWith(".docx")){
   const result=await mammoth.extractRawText({buffer});
   text=result.value;
  }else if(name.endsWith(".pdf")){
   const result=await pdf(buffer);
   text=result.text;
  }else return NextResponse.json({error:"Supported formats: PDF and DOCX."},{status:415});
  text=text.replace(/\u0000/g," ").replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim();
  if(text.length<120) return NextResponse.json({error:"This file has too little readable text to be a resume. Please upload a text-based PDF or DOCX resume."},{status:422});
  // A readable document is not necessarily a resume. Look for several independent resume signals
  // so unrelated PDFs (scripts, articles, assignment briefs) are not added to the candidate pool.
  const lower=text.toLowerCase();
  const signals = [
   /\b(resume|curriculum vitae|work experience|professional experience|employment history)\b/.test(lower),
   /\b(education|academic background|qualification|degree|university|college)\b/.test(lower),
   /\b(skills|technical skills|core competencies|key skills)\b/.test(lower),
   /\b(projects|selected projects|portfolio|certifications|certificates)\b/.test(lower),
   /\b([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|linkedin\.com|github\.com)\b/.test(lower),
   /\b(experience|internship|intern|engineer|designer|analyst|developer|consultant)\b/.test(lower)
  ];
  const signalCount=signals.filter(Boolean).length;
  if(signalCount<2 || (!signals[0] && !signals[1] && !signals[2] && !signals[3])) {
   return NextResponse.json({error:"This document doesn't look like a resume (no clear combination of experience, education, skills, projects or contact details was found). It was not added. Please upload a candidate resume in PDF or DOCX format."},{status:422});
  }
  const id=`upload-${Date.now()}`;
  const candidate={id,filename:file.name,text,status:"uploaded"};
  const result=classify(candidate);
  return NextResponse.json({candidate,result});
 }catch(e){
  return NextResponse.json({error:"Could not process this resume. Try another DOCX or text-based PDF."},{status:500});
 }
}