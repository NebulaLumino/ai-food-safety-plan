import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api.deepseek.com/v1',
    });

    const { cuisineType, foodHandlingRisks, kitchenSetup, storageCapacity, localHealthCodes } = await req.json();

    const prompt = `You are a certified food safety expert and HACCP (Hazard Analysis Critical Control Points) consultant. Generate a comprehensive food safety plan.

**Cuisine Type:** ${cuisineType}
**Food Handling Risks:** ${foodHandlingRisks || 'General'}
**Kitchen Setup:** ${kitchenSetup}
**Storage Capacity:** ${storageCapacity}
**Local Health Codes:** ${localHealthCodes || 'FDA Food Code / Generic'}

Please provide:

## 📋 HACCP PLAN SUMMARY
A brief overview of your food safety program:
- What makes this ${cuisineType} kitchen a higher-risk environment
- Number of Critical Control Points (CCPs) identified
- Overall risk level: [Low / Medium / High]

## 🔴 CRITICAL CONTROL POINTS (CCPs)
List the key CCPs for a ${cuisineType} kitchen:

### CCP 1: [Name — e.g., Cooking Temperatures]
- **Hazard:** Biological / Chemical / Physical
- **Critical Limit:** [e.g., Internal temp must reach 145°F for 15 seconds for fish]
- **Monitoring:** [Who monitors, how often, what method]
- **Corrective Action:** [What to do if limit is not met]
- **Verification:** [How to confirm CCP is under control]

### CCP 2: [Name — e.g., Cold Holding]
(repeat structure)

### CCP 3: [Name — e.g., Date Marking / TCS Foods]
(repeat structure)

### CCP 4: [Name — e.g., Cross-Contamination Prevention]
(repeat structure)

## 🌡️ TEMPERATURE MONITORING CHECKLIST
A daily temperature log for ${cuisineType} kitchen:

### Refrigeration (≤ 41°F / 5°C)
- [ ] Walk-in cooler #1: Morning __°F | Evening __°F
- [ ] Walk-in cooler #2: Morning __°F | Evening __°F
- [ ] Reach-in undercounter: Morning __°F | Evening __°F
- [ ] Prep fridge: Morning __°F | Evening __°F
- [ ] Beverage cooler: Morning __°F | Evening __°F

### Freezer (≤ 0°F / -18°C)
- [ ] Walk-in freezer: Morning __°F | Evening __°F
- [ ] Storage freezer: Morning __°F | Evening __°F

### Hot Holding (≥ 135°F / 57°C)
- [ ] Hot holding unit #1: __°F (check every 2 hours)
- [ ] Steam table: __°F (check every 2 hours)

### Cooking Temperatures (${cuisineType}-specific):
- Poultry / stuffed meats: 165°F
- Fish: 145°F
- Ground beef/pork: 160°F
- Steaks/chops: 145°F
- [Cuisine-specific items to verify]

## 🧊 DATE MARKING PROTOCOL
For TCS (Time/Temperature Control for Safety) foods prepared in-house:
- Prepared on: [Date]
- Use by (7 days max): [Date]
- Label format: [Contents] | [Prep date] | [Use-by date] | [Initials]
- Checklist: All date-marked items in walk-in cooler verified daily

## 🧹 SANITATION STANDARD OPERATING PROCEDURES (SSOPs)
Daily cleaning schedule:
### Opening
- [ ] Sanitize all prep surfaces
- [ ] Sanitize cutting boards (color-coded)
- [ ] Check sanitizer concentration (ppm): ___
- [ ] Verify handwashing stations stocked

### During Service
- [ ] Wipe down surfaces every 30 min
- [ ] Change sanitizing cloths every 2 hours
- [ ] Maintain handwashing protocol

### Closing
- [ ] Deep clean all prep surfaces
- [ ] Sanitize equipment ( slicer, mixer, etc. )
- [ ] Clean and sanitize floor mats
- [ ] Verify no pest activity

## ⚠️ HIGH-RISK INGREDIENTS FOR ${cuisineType}
For ${cuisineType} cuisine specifically:
- Raw meats / poultry (cross-contamination risk)
- [Cuisine-specific: e.g., raw fish in Japanese cuisine — parasites]
- [Cuisine-specific: e.g., sprouts in Asian cuisine — bacterial growth]
- [Cuisine-specific: e.g., dairy-based sauces — temperature abuse]
- [Cuisine-specific: e.g., fermented foods — toxin formation]

For each: specific handling, cooking, and storage requirements.

## 🦠 ALLERGEN MANAGEMENT
For ${cuisineType} kitchen:
- Big 9 allergens to track: Milk, Eggs, Fish, Shellfish, Tree Nuts, Peanuts, Wheat, Soy, Sesame
- Protocols: Separate prep areas, color-coded utensils, staff training
- Menu labeling requirements: ${localHealthCodes}

## 📚 STAFF TRAINING REQUIREMENTS
Required certifications:
- [ ] Food Handler's Card (all staff)
- [ ] Food Safety Manager Certification (at least 1 manager per shift)
- [ ] Allergen awareness training
- [ ] HACCP plan review for kitchen staff
- Refresher frequency: [Annually / Semi-annually]

## ✅ HEALTH CODE COMPLIANCE TIPS
Top 5 violations to watch for in ${localHealthCodes} inspections:
1. [Violation + prevention tip]
2. [Violation + prevention tip]
3. [Violation + prevention tip]
4. [Violation + prevention tip]
5. [Violation + prevention tip]

## 🗂️ DOCUMENTATION CHECKLIST
What to keep on file:
- [ ] Temperature logs (daily, 30-day retention)
- [ ] Cleaning schedules & logs
- [ ] Pest control service records
- [ ] Staff food handler certifications
- [ ] Equipment calibration records (thermometers)
- [ ] Supplier invoices / food source records
- [ ] Recall notifications log
- [ ] Incident/illness reports

Format with bold headers, emojis, checklists (checkbox format), structured tables. Be specific and actionable.`;

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 4000,
    });

    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error: unknown) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
