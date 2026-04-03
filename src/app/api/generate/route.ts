"use server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { establishmentType, cuisineType, foodCategories, volume, staffingLevel, priorViolations, certificationLevel } = await req.json();
    const openai = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a food safety expert with deep knowledge of HACCP (Hazard Analysis Critical Control Points), FDA Food Code, local health codes, and food service operations safety. Provide comprehensive, compliance-ready plans." },
        { role: "user", content: `Generate a comprehensive HACCP food safety plan for a food service operation.

**Establishment Details:**
- Type: ${establishmentType}
- Cuisine: ${cuisineType}
- Food Categories Handled: ${foodCategories || "General food service"}
- Volume: ${volume}
- Staffing Level: ${staffingLevel}
- Prior Violations: ${priorViolations || "None reported"}
- Certification Level Target: ${certificationLevel}

Generate a detailed plan covering ALL of the following sections:

## 1. Hazard Analysis
Identify biological, chemical, and physical hazards for the establishment type and cuisine. Rank by risk level.

## 2. Critical Control Points (CCPs)
List all critical control points with:
- Control point name
- Hazard addressed
- Critical limit
- Monitoring procedure

## 3. Monitoring Procedures
Step-by-step monitoring protocols for each CCP, including frequency, method, and responsible person.

## 4. Corrective Actions
What to do when a CCP deviates from critical limits — written procedures for each major CCP.

## 5. Verification Schedule
Temperature log schedules, equipment calibration procedures, microbial testing frequency, and internal audit schedule.

## 6. Staff Training Plan
Training topics, frequency, and documentation requirements for food safety staff certification at ${certificationLevel} level.

Include temperature danger zone guidance, HACCP plan forms/templates where applicable. Format as clean markdown with clear headers and tables.` },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });
    return NextResponse.json({ output: completion.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
