export type MealItem = { food: string; qty: string };
export type Meal = { time: string; title: string; items: MealItem[] };
export type WeekFocus = { week: string; focus: string; swaps: string[] };
export type GroceryLine = {
  item: string;
  qty: string;
  rate: string;
  price: number;
};

export type Condition = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  summary: string;
  calories: string;
  macros: { label: string; value: string }[];
  meals: Meal[];
  weeks: WeekFocus[];
  avoid: string[];
  grocery: GroceryLine[];
  monthlyPrice: number;
  expertNote: string;
};

export const conditions: Condition[] = [
  {
    slug: "type-2-diabetes",
    name: "Type 2 Diabetes",
    category: "Metabolic",
    tagline: "Low glycaemic, fibre-forward, fixed carb portions",
    summary:
      "A 30-day plan that keeps carbohydrate load at 45–50% of energy, split evenly across six small meals to avoid post-meal glucose spikes. Every portion is weighed in grams so the carb count per meal stays predictable.",
    calories: "1,600–1,800 kcal / day",
    macros: [
      { label: "Carbohydrate", value: "180–200 g (45–50%)" },
      { label: "Protein", value: "75–85 g (1.2 g/kg)" },
      { label: "Fat", value: "45–50 g (visible oil 20 g)" },
      { label: "Fibre", value: "32–35 g" },
    ],
    meals: [
      {
        time: "6:30 AM",
        title: "Early morning",
        items: [
          { food: "Fenugreek-soaked water", qty: "200 ml (1 tsp seeds soaked overnight)" },
          { food: "Soaked almonds", qty: "5 pieces (7 g)" },
        ],
      },
      {
        time: "8:30 AM",
        title: "Breakfast",
        items: [
          { food: "Vegetable oats upma / besan chilla", qty: "50 g dry oats or 40 g besan" },
          { food: "Mixed vegetables (bottle gourd, carrot, beans)", qty: "100 g" },
          { food: "Low-fat curd", qty: "100 g" },
          { food: "Groundnut oil", qty: "5 ml" },
        ],
      },
      {
        time: "11:00 AM",
        title: "Mid-morning",
        items: [
          { food: "Guava or apple (low GI fruit)", qty: "100 g" },
          { food: "Roasted chana", qty: "15 g" },
        ],
      },
      {
        time: "1:30 PM",
        title: "Lunch",
        items: [
          { food: "Multigrain roti (no ghee)", qty: "2 pieces (60 g flour)" },
          { food: "Cooked mixed dal", qty: "150 g (30 g raw)" },
          { food: "Green leafy sabzi", qty: "150 g" },
          { food: "Cucumber–tomato salad", qty: "100 g" },
          { food: "Curd", qty: "100 g" },
        ],
      },
      {
        time: "5:00 PM",
        title: "Evening",
        items: [
          { food: "Unsweetened green tea", qty: "150 ml" },
          { food: "Sprouted moong chaat", qty: "50 g cooked" },
        ],
      },
      {
        time: "8:00 PM",
        title: "Dinner",
        items: [
          { food: "Millet roti (bajra/jowar)", qty: "2 pieces (50 g flour)" },
          { food: "Paneer / soya / chicken curry", qty: "80 g paneer or 100 g chicken" },
          { food: "Steamed vegetables", qty: "150 g" },
        ],
      },
      {
        time: "10:00 PM",
        title: "Bedtime",
        items: [{ food: "Toned milk with cinnamon", qty: "150 ml" }],
      },
    ],
    weeks: [
      {
        week: "Week 1",
        focus: "Stabilise fasting sugar, remove refined carbs",
        swaps: ["White rice → millet/brown rice 40 g", "Sugar → 2 g stevia", "Fruit juice → whole fruit 100 g"],
      },
      {
        week: "Week 2",
        focus: "Raise fibre to 35 g, add 30-min post-meal walk",
        swaps: ["Add 1 tsp (5 g) flaxseed powder to breakfast", "Roti flour: 50% whole wheat + 50% barley"],
      },
      {
        week: "Week 3",
        focus: "Protein optimisation to protect muscle mass",
        swaps: ["Add 30 g sprouts to lunch", "Dinner protein up to 100 g paneer"],
      },
      {
        week: "Week 4",
        focus: "Maintenance, one planned flexible meal per week",
        swaps: ["Flexible meal capped at 350 kcal", "Re-check HbA1c and adjust portions"],
      },
    ],
    avoid: [
      "Sugar, jaggery, honey, packed juices",
      "White rice, maida, bakery items",
      "Potato, sweet potato, banana, mango, chikoo",
      "Deep-fried snacks and reheated oils",
    ],
    grocery: [
      { item: "Multigrain atta", qty: "3 kg", rate: "₹62/kg", price: 186 },
      { item: "Bajra + jowar flour", qty: "2 kg", rate: "₹58/kg", price: 116 },
      { item: "Mixed dals (moong, masoor, chana)", qty: "3 kg", rate: "₹128/kg", price: 384 },
      { item: "Rolled oats", qty: "1.5 kg", rate: "₹160/kg", price: 240 },
      { item: "Seasonal vegetables", qty: "9 kg", rate: "₹48/kg", price: 432 },
      { item: "Low GI fruits (guava, apple, papaya)", qty: "3 kg", rate: "₹110/kg", price: 330 },
      { item: "Paneer / soya chunks", qty: "1.5 kg", rate: "₹340/kg", price: 510 },
      { item: "Toned milk + curd", qty: "30 L", rate: "₹56/L", price: 1680 },
      { item: "Almonds, flaxseed, methi seeds", qty: "900 g", rate: "₹740/kg", price: 666 },
      { item: "Cold-pressed groundnut oil", qty: "600 ml", rate: "₹210/L", price: 126 },
    ],
    monthlyPrice: 4670,
    expertNote:
      "Do not change insulin or oral medication doses on your own — share your 7-day sugar log with our clinical dietitian in the Ask an Expert section first.",
  },
  {
    slug: "hypertension",
    name: "Hypertension",
    category: "Cardiac",
    tagline: "DASH-style, sodium capped at 1,500 mg/day",
    summary:
      "A DASH-pattern month focused on potassium, magnesium and calcium rich foods with total salt weighed at 3.5 g/day (about ¾ tsp) for the whole household portion.",
    calories: "1,700–1,900 kcal / day",
    macros: [
      { label: "Sodium", value: "1,400–1,500 mg (3.5 g salt)" },
      { label: "Potassium", value: "3,500–4,000 mg" },
      { label: "Protein", value: "70–80 g" },
      { label: "Saturated fat", value: "< 15 g" },
    ],
    meals: [
      {
        time: "7:00 AM",
        title: "Early morning",
        items: [
          { food: "Warm water with lemon", qty: "200 ml" },
          { food: "Soaked walnuts", qty: "2 halves (8 g)" },
        ],
      },
      {
        time: "8:30 AM",
        title: "Breakfast",
        items: [
          { food: "Vegetable poha / idli (no fried tempering)", qty: "120 g cooked" },
          { food: "Coconut-mint chutney (unsalted)", qty: "30 g" },
          { food: "Skimmed milk", qty: "150 ml" },
        ],
      },
      {
        time: "11:00 AM",
        title: "Mid-morning",
        items: [{ food: "Banana or orange (potassium)", qty: "100 g" }],
      },
      {
        time: "1:30 PM",
        title: "Lunch",
        items: [
          { food: "Whole wheat roti", qty: "2 pieces (60 g flour)" },
          { food: "Brown rice", qty: "60 g raw" },
          { food: "Dal with 1 g salt", qty: "150 g cooked" },
          { food: "Palak / methi sabzi", qty: "150 g" },
          { food: "Curd (unsalted)", qty: "100 g" },
        ],
      },
      {
        time: "5:00 PM",
        title: "Evening",
        items: [
          { food: "Hibiscus / green tea", qty: "150 ml" },
          { food: "Roasted makhana (unsalted)", qty: "20 g" },
        ],
      },
      {
        time: "8:00 PM",
        title: "Dinner",
        items: [
          { food: "Vegetable khichdi", qty: "200 g cooked" },
          { food: "Grilled fish / tofu", qty: "100 g" },
          { food: "Steamed beans + carrot", qty: "150 g" },
        ],
      },
    ],
    weeks: [
      { week: "Week 1", focus: "Cut hidden sodium", swaps: ["Remove pickles, papad, sauces", "Salt jar measured to 105 g for the month"] },
      { week: "Week 2", focus: "Potassium loading", swaps: ["Add 150 g coconut water 3x/week", "Daily leafy greens 150 g"] },
      { week: "Week 3", focus: "Heart fats", swaps: ["Add 2 servings fatty fish or 10 g flaxseed", "Cook in mustard/olive oil 15 ml/day"] },
      { week: "Week 4", focus: "BP re-check and portion lock", swaps: ["Log BP morning and evening", "Maintain 3.5 g salt cap"] },
    ],
    avoid: ["Pickles, papad, chips, namkeen", "Processed meat, cheese spreads", "Baking soda cooked foods", "Alcohol and energy drinks"],
    grocery: [
      { item: "Whole wheat atta", qty: "3 kg", rate: "₹48/kg", price: 144 },
      { item: "Brown rice", qty: "2 kg", rate: "₹95/kg", price: 190 },
      { item: "Dals and pulses", qty: "2.5 kg", rate: "₹128/kg", price: 320 },
      { item: "Leafy + seasonal vegetables", qty: "10 kg", rate: "₹46/kg", price: 460 },
      { item: "Potassium-rich fruits", qty: "4 kg", rate: "₹95/kg", price: 380 },
      { item: "Skimmed milk & curd", qty: "25 L", rate: "₹54/L", price: 1350 },
      { item: "Fish / tofu", qty: "2 kg", rate: "₹320/kg", price: 640 },
      { item: "Makhana, walnuts, flaxseed", qty: "800 g", rate: "₹690/kg", price: 552 },
      { item: "Mustard + olive oil", qty: "700 ml", rate: "₹340/L", price: 238 },
    ],
    monthlyPrice: 4274,
    expertNote:
      "If you are on diuretics, your potassium targets must be individualised — book a 20-minute call before starting week 2.",
  },
  {
    slug: "pcos",
    name: "PCOS / PCOD",
    category: "Hormonal",
    tagline: "Insulin-sensitising, anti-inflammatory, cycle-supportive",
    summary:
      "Built around a low-glycaemic load, 1.4 g/kg protein and inositol-rich foods, with a deliberate 12-hour overnight fast to improve insulin sensitivity across the month.",
    calories: "1,500–1,700 kcal / day",
    macros: [
      { label: "Carbohydrate", value: "150–165 g, low GI" },
      { label: "Protein", value: "80–90 g" },
      { label: "Fat", value: "50 g (omega-3 focused)" },
      { label: "Fibre", value: "30 g" },
    ],
    meals: [
      { time: "7:00 AM", title: "Early morning", items: [{ food: "Cinnamon water", qty: "200 ml" }, { food: "Soaked walnuts + pumpkin seeds", qty: "15 g" }] },
      { time: "9:00 AM", title: "Breakfast", items: [{ food: "Moong dal chilla / egg bhurji", qty: "40 g dal or 2 eggs" }, { food: "Sautéed vegetables", qty: "100 g" }, { food: "Curd", qty: "100 g" }] },
      { time: "12:00 PM", title: "Mid-morning", items: [{ food: "Berries or pomegranate", qty: "100 g" }] },
      { time: "2:00 PM", title: "Lunch", items: [{ food: "Jowar roti", qty: "2 pieces (50 g flour)" }, { food: "Rajma / chana curry", qty: "150 g cooked" }, { food: "Salad with olive oil", qty: "150 g + 5 ml" }] },
      { time: "5:30 PM", title: "Evening", items: [{ food: "Spearmint tea", qty: "150 ml" }, { food: "Roasted seeds mix", qty: "15 g" }] },
      { time: "8:00 PM", title: "Dinner", items: [{ food: "Grilled paneer / chicken", qty: "100 g" }, { food: "Quinoa or millet", qty: "40 g raw" }, { food: "Stir-fried greens", qty: "150 g" }] },
    ],
    weeks: [
      { week: "Week 1", focus: "Remove refined sugar and dairy excess", swaps: ["Milk tea → spearmint tea", "Sugar → 100% cut"] },
      { week: "Week 2", focus: "Seed cycling (follicular)", swaps: ["Flax 10 g + pumpkin 10 g daily"] },
      { week: "Week 3", focus: "Seed cycling (luteal)", swaps: ["Sesame 10 g + sunflower 10 g daily"] },
      { week: "Week 4", focus: "Strength training + protein hold", swaps: ["Protein 90 g/day", "12-hour overnight fast daily"] },
    ],
    avoid: ["Sugary drinks, desserts, bakery", "Excess dairy beyond 250 ml/day", "Soy processed foods in excess", "Late-night eating past 9 PM"],
    grocery: [
      { item: "Jowar / quinoa / millets", qty: "3 kg", rate: "₹135/kg", price: 405 },
      { item: "Rajma, chana, moong", qty: "2.5 kg", rate: "₹140/kg", price: 350 },
      { item: "Eggs / chicken / paneer", qty: "3 kg equiv.", rate: "₹300/kg", price: 900 },
      { item: "Vegetables", qty: "9 kg", rate: "₹48/kg", price: 432 },
      { item: "Berries, pomegranate", qty: "3 kg", rate: "₹180/kg", price: 540 },
      { item: "Seed cycling mix (4 seeds)", qty: "1.2 kg", rate: "₹520/kg", price: 624 },
      { item: "Curd / Greek yogurt", qty: "6 kg", rate: "₹120/kg", price: 720 },
      { item: "Olive oil", qty: "500 ml", rate: "₹780/L", price: 390 },
    ],
    monthlyPrice: 4361,
    expertNote: "Share your last ultrasound and AMH/insulin reports so the plan can be matched to your phenotype.",
  },
  {
    slug: "thyroid-hypothyroidism",
    name: "Hypothyroidism",
    category: "Hormonal",
    tagline: "Iodine, selenium and zinc sufficient, goitrogen timed",
    summary:
      "Supports thyroxine absorption with strict medicine-food gaps, adequate selenium and zinc, and cooked-only cruciferous vegetables kept under 200 g per day.",
    calories: "1,500–1,700 kcal / day",
    macros: [
      { label: "Protein", value: "75 g" },
      { label: "Selenium", value: "60–70 mcg (2 brazil nuts)" },
      { label: "Iodine", value: "150 mcg (iodised salt 3 g)" },
      { label: "Fibre", value: "30 g" },
    ],
    meals: [
      { time: "6:30 AM", title: "Medicine", items: [{ food: "Thyroxine with plain water — no food for 45 min", qty: "200 ml water" }] },
      { time: "8:00 AM", title: "Breakfast", items: [{ food: "Vegetable dalia / upma", qty: "50 g dry" }, { food: "Brazil nuts", qty: "2 pieces" }, { food: "Boiled egg", qty: "1 whole" }] },
      { time: "11:00 AM", title: "Mid-morning", items: [{ food: "Seasonal fruit", qty: "150 g" }] },
      { time: "1:30 PM", title: "Lunch", items: [{ food: "Roti", qty: "2 pieces (60 g flour)" }, { food: "Dal", qty: "150 g cooked" }, { food: "Cooked sabzi", qty: "150 g" }, { food: "Curd", qty: "100 g" }] },
      { time: "5:00 PM", title: "Evening", items: [{ food: "Roasted pumpkin seeds", qty: "15 g" }, { food: "Herbal tea", qty: "150 ml" }] },
      { time: "8:00 PM", title: "Dinner", items: [{ food: "Millet khichdi", qty: "200 g cooked" }, { food: "Fish / paneer", qty: "100 g" }, { food: "Cooked vegetables", qty: "150 g" }] },
    ],
    weeks: [
      { week: "Week 1", focus: "Fix medicine-food timing", swaps: ["No calcium/iron within 4 hours of thyroxine"] },
      { week: "Week 2", focus: "Micronutrient repair", swaps: ["Add 2 brazil nuts + 15 g pumpkin seeds daily"] },
      { week: "Week 3", focus: "Gut and energy", swaps: ["Add 100 g fermented food 4x/week"] },
      { week: "Week 4", focus: "Weight and TSH review", swaps: ["Re-test TSH, adjust calories ±150 kcal"] },
    ],
    avoid: ["Raw cabbage, cauliflower, broccoli in large amounts", "Soy within 4 hours of medicine", "Excess processed and refined food", "Coffee immediately after thyroxine"],
    grocery: [
      { item: "Whole wheat + millet flour", qty: "4 kg", rate: "₹55/kg", price: 220 },
      { item: "Dalia, oats, millets", qty: "2 kg", rate: "₹120/kg", price: 240 },
      { item: "Dals", qty: "2.5 kg", rate: "₹128/kg", price: 320 },
      { item: "Eggs / fish / paneer", qty: "3 kg equiv.", rate: "₹290/kg", price: 870 },
      { item: "Vegetables + fruits", qty: "12 kg", rate: "₹58/kg", price: 696 },
      { item: "Brazil nuts + pumpkin seeds", qty: "700 g", rate: "₹950/kg", price: 665 },
      { item: "Milk & curd", qty: "20 L", rate: "₹58/L", price: 1160 },
      { item: "Iodised salt + oils", qty: "1 set", rate: "—", price: 260 },
    ],
    monthlyPrice: 4431,
    expertNote: "Bring your latest TSH, T3, T4 and vitamin D values to the first consultation.",
  },
  {
    slug: "fatty-liver",
    name: "Fatty Liver (NAFLD)",
    category: "Digestive",
    tagline: "Calorie deficit, zero fructose load, high choline",
    summary:
      "A structured 500 kcal daily deficit with fructose restriction and choline-rich foods, aimed at 5–7% body weight reduction over the month — the strongest driver of liver fat reversal.",
    calories: "1,400–1,600 kcal / day",
    macros: [
      { label: "Carbohydrate", value: "150 g, no added sugar" },
      { label: "Protein", value: "85 g" },
      { label: "Fat", value: "40 g, saturated < 12 g" },
      { label: "Fibre", value: "35 g" },
    ],
    meals: [
      { time: "7:00 AM", title: "Early morning", items: [{ food: "Warm water + lemon", qty: "250 ml" }] },
      { time: "8:30 AM", title: "Breakfast", items: [{ food: "Oats porridge with skim milk", qty: "45 g oats + 150 ml milk" }, { food: "Chia seeds", qty: "10 g" }] },
      { time: "11:30 AM", title: "Mid-morning", items: [{ food: "Papaya or guava", qty: "150 g" }] },
      { time: "1:30 PM", title: "Lunch", items: [{ food: "Roti (no oil)", qty: "2 pieces (60 g flour)" }, { food: "Dal / sprouts curry", qty: "150 g cooked" }, { food: "Sabzi", qty: "200 g" }, { food: "Salad", qty: "150 g" }] },
      { time: "5:00 PM", title: "Evening", items: [{ food: "Green tea", qty: "150 ml" }, { food: "Roasted chana", qty: "25 g" }] },
      { time: "7:30 PM", title: "Dinner", items: [{ food: "Grilled chicken / tofu", qty: "120 g" }, { food: "Vegetable soup", qty: "200 ml" }, { food: "Millet roti", qty: "1 piece (25 g flour)" }] },
    ],
    weeks: [
      { week: "Week 1", focus: "Eliminate fructose and alcohol", swaps: ["No juice, soft drink, sweets, alcohol"] },
      { week: "Week 2", focus: "Deficit + 8,000 steps", swaps: ["Reduce dinner carbs to 25 g flour"] },
      { week: "Week 3", focus: "Protein and coffee", swaps: ["2 cups black coffee/day", "Protein up to 90 g"] },
      { week: "Week 4", focus: "Weight and LFT review", swaps: ["Target 3–4 kg loss", "Repeat SGOT/SGPT"] },
    ],
    avoid: ["Alcohol in every form", "Fruit juice, soft drinks, sweets", "Fried food, ghee-heavy dishes", "Red and processed meat"],
    grocery: [
      { item: "Oats, millets, whole wheat", qty: "4 kg", rate: "₹90/kg", price: 360 },
      { item: "Dals + sprouts", qty: "3 kg", rate: "₹130/kg", price: 390 },
      { item: "Chicken / tofu", qty: "3 kg", rate: "₹260/kg", price: 780 },
      { item: "Vegetables", qty: "12 kg", rate: "₹48/kg", price: 576 },
      { item: "Low-fructose fruits", qty: "4 kg", rate: "₹80/kg", price: 320 },
      { item: "Skim milk & curd", qty: "18 L", rate: "₹52/L", price: 936 },
      { item: "Chia, walnut, green tea", qty: "900 g", rate: "₹640/kg", price: 576 },
    ],
    monthlyPrice: 3938,
    expertNote: "If your fibroscan or elastography shows fibrosis, the plan is modified with a hepatologist-aligned protein target.",
  },
  {
    slug: "ckd-stage-3",
    name: "Kidney Disease (CKD Stage 3)",
    category: "Renal",
    tagline: "Controlled protein, potassium and phosphorus",
    summary:
      "Protein is capped at 0.7 g/kg with high biological value sources, and every high-potassium vegetable is leached before cooking. All quantities are weighed — this plan is not safe to improvise.",
    calories: "1,800–2,000 kcal / day",
    macros: [
      { label: "Protein", value: "0.7 g/kg (≈45–50 g)" },
      { label: "Potassium", value: "< 2,000 mg" },
      { label: "Phosphorus", value: "< 800 mg" },
      { label: "Sodium", value: "< 2,000 mg" },
    ],
    meals: [
      { time: "7:00 AM", title: "Early morning", items: [{ food: "Plain water as per fluid allowance", qty: "150 ml" }] },
      { time: "8:30 AM", title: "Breakfast", items: [{ food: "Rice flakes poha (leached vegetables)", qty: "50 g dry" }, { food: "Apple", qty: "100 g" }] },
      { time: "11:00 AM", title: "Mid-morning", items: [{ food: "Sago / arrowroot kanji", qty: "150 ml" }] },
      { time: "1:30 PM", title: "Lunch", items: [{ food: "Rice", qty: "80 g raw" }, { food: "Thin dal", qty: "100 g cooked (15 g raw)" }, { food: "Leached lauki / tinda sabzi", qty: "150 g" }] },
      { time: "4:30 PM", title: "Evening", items: [{ food: "Rice puffs / murmura (unsalted)", qty: "25 g" }] },
      { time: "7:30 PM", title: "Dinner", items: [{ food: "Roti", qty: "2 pieces (60 g flour)" }, { food: "Egg white / paneer (measured)", qty: "2 whites or 40 g" }, { food: "Leached vegetable curry", qty: "150 g" }] },
    ],
    weeks: [
      { week: "Week 1", focus: "Learn leaching + fluid logging", swaps: ["Double-boil all vegetables and discard water"] },
      { week: "Week 2", focus: "Phosphorus control", swaps: ["Stop nuts, whole dals, cola drinks"] },
      { week: "Week 3", focus: "Energy adequacy", swaps: ["Add 15 ml oil to prevent muscle breakdown"] },
      { week: "Week 4", focus: "Review labs", swaps: ["Recheck creatinine, eGFR, potassium"] },
    ],
    avoid: ["Coconut water, banana, orange, tomato in excess", "Nuts, seeds, whole pulses", "Cola, packaged soups, processed cheese", "Salt substitutes containing potassium"],
    grocery: [
      { item: "Rice + poha + murmura", qty: "5 kg", rate: "₹68/kg", price: 340 },
      { item: "Wheat atta", qty: "3 kg", rate: "₹48/kg", price: 144 },
      { item: "Low-potassium vegetables", qty: "10 kg", rate: "₹52/kg", price: 520 },
      { item: "Permitted fruits (apple, pear)", qty: "3 kg", rate: "₹150/kg", price: 450 },
      { item: "Eggs / paneer (measured)", qty: "2 kg equiv.", rate: "₹280/kg", price: 560 },
      { item: "Dal (limited)", qty: "1 kg", rate: "₹130/kg", price: 130 },
      { item: "Sago, arrowroot, oil", qty: "1 set", rate: "—", price: 420 },
    ],
    monthlyPrice: 3564,
    expertNote:
      "Renal plans must be reviewed with your nephrologist. Send your latest creatinine, eGFR, potassium and phosphorus before ordering.",
  },
  {
    slug: "ibs-gut-health",
    name: "IBS & Gut Health",
    category: "Digestive",
    tagline: "Low-FODMAP elimination and structured reintroduction",
    summary:
      "Three weeks of strict low-FODMAP eating followed by a structured reintroduction week, so you finish the month knowing exactly which foods trigger your symptoms.",
    calories: "1,700–1,900 kcal / day",
    macros: [
      { label: "Protein", value: "75 g" },
      { label: "Soluble fibre", value: "12–15 g" },
      { label: "Fat", value: "50 g, low at single sitting" },
      { label: "Meals", value: "5 small meals, 3 h apart" },
    ],
    meals: [
      { time: "7:30 AM", title: "Early morning", items: [{ food: "Ginger–ajwain water", qty: "200 ml" }] },
      { time: "8:30 AM", title: "Breakfast", items: [{ food: "Rice idli / oats with lactose-free milk", qty: "2 idli or 40 g oats" }, { food: "Peanut chutney", qty: "25 g" }] },
      { time: "11:30 AM", title: "Mid-morning", items: [{ food: "Ripe banana or kiwi", qty: "100 g" }] },
      { time: "1:30 PM", title: "Lunch", items: [{ food: "Rice", qty: "70 g raw" }, { food: "Moong dal (skinless)", qty: "120 g cooked" }, { food: "Low-FODMAP sabzi (carrot, pumpkin, zucchini)", qty: "150 g" }, { food: "Curd", qty: "100 g" }] },
      { time: "5:00 PM", title: "Evening", items: [{ food: "Peppermint tea", qty: "150 ml" }, { food: "Rice crackers", qty: "20 g" }] },
      { time: "8:00 PM", title: "Dinner", items: [{ food: "Khichdi with ghee", qty: "200 g + 5 g ghee" }, { food: "Grilled chicken / tofu", qty: "100 g" }] },
    ],
    weeks: [
      { week: "Week 1", focus: "Elimination begins", swaps: ["No onion, garlic, wheat, milk", "Use garlic-infused oil for flavour"] },
      { week: "Week 2", focus: "Symptom diary", swaps: ["Log bloating, stool form (Bristol scale) daily"] },
      { week: "Week 3", focus: "Gut repair", swaps: ["Add 100 g curd + 5 g psyllium at night"] },
      { week: "Week 4", focus: "Reintroduction", swaps: ["Add one FODMAP group every 3 days and observe"] },
    ],
    avoid: ["Onion, garlic, wheat during elimination", "Rajma, chole, milk, cauliflower", "Artificial sweeteners ending in -ol", "Caffeine on an empty stomach"],
    grocery: [
      { item: "Rice + rice products", qty: "4 kg", rate: "₹72/kg", price: 288 },
      { item: "Skinless moong dal", qty: "2 kg", rate: "₹142/kg", price: 284 },
      { item: "Low-FODMAP vegetables", qty: "9 kg", rate: "₹55/kg", price: 495 },
      { item: "Permitted fruits", qty: "3 kg", rate: "₹90/kg", price: 270 },
      { item: "Chicken / tofu", qty: "2.5 kg", rate: "₹270/kg", price: 675 },
      { item: "Lactose-free milk & curd", qty: "12 L", rate: "₹95/L", price: 1140 },
      { item: "Garlic-infused oil, ghee, psyllium", qty: "1 set", rate: "—", price: 520 },
    ],
    monthlyPrice: 3672,
    expertNote: "Red-flag symptoms (blood in stool, unexplained weight loss) need a gastroenterologist before any diet change.",
  },
  {
    slug: "weight-loss",
    name: "Obesity & Weight Loss",
    category: "Metabolic",
    tagline: "High-satiety deficit with weighed portions",
    summary:
      "A sustainable 500–600 kcal deficit with 1.6 g/kg protein to protect lean mass, designed for 3–4 kg loss in the first month without crash dieting.",
    calories: "1,300–1,500 kcal / day",
    macros: [
      { label: "Protein", value: "95–105 g" },
      { label: "Carbohydrate", value: "130–150 g" },
      { label: "Fat", value: "40 g" },
      { label: "Fibre", value: "30–35 g" },
    ],
    meals: [
      { time: "7:00 AM", title: "Early morning", items: [{ food: "Warm water + soaked methi", qty: "250 ml" }] },
      { time: "8:30 AM", title: "Breakfast", items: [{ food: "Egg white omelette / besan chilla", qty: "4 whites or 40 g besan" }, { food: "Vegetables", qty: "100 g" }, { food: "Multigrain toast", qty: "1 slice (30 g)" }] },
      { time: "11:30 AM", title: "Mid-morning", items: [{ food: "Buttermilk", qty: "200 ml" }, { food: "Apple", qty: "100 g" }] },
      { time: "1:30 PM", title: "Lunch", items: [{ food: "Roti", qty: "2 pieces (50 g flour)" }, { food: "Dal / chicken curry", qty: "150 g" }, { food: "Sabzi", qty: "200 g" }, { food: "Salad", qty: "150 g" }] },
      { time: "5:00 PM", title: "Evening", items: [{ food: "Green tea", qty: "150 ml" }, { food: "Roasted makhana", qty: "20 g" }] },
      { time: "7:45 PM", title: "Dinner", items: [{ food: "Grilled paneer / fish", qty: "120 g" }, { food: "Sautéed vegetables", qty: "200 g" }, { food: "Millet roti", qty: "1 piece (25 g flour)" }] },
    ],
    weeks: [
      { week: "Week 1", focus: "Portion calibration with a kitchen scale", swaps: ["Weigh every grain and oil portion"] },
      { week: "Week 2", focus: "Protein at every meal", swaps: ["Minimum 25 g protein per main meal"] },
      { week: "Week 3", focus: "Break the plateau", swaps: ["Two low-carb days at 110 g carbs"] },
      { week: "Week 4", focus: "Habit lock-in", swaps: ["One planned flexible meal", "10,000 steps daily"] },
    ],
    avoid: ["Sugary beverages and desserts", "Fried snacks, bakery, packaged chips", "Late-night snacking", "Liquid calories including alcohol"],
    grocery: [
      { item: "Multigrain + millet flour", qty: "3 kg", rate: "₹62/kg", price: 186 },
      { item: "Dals and pulses", qty: "2.5 kg", rate: "₹130/kg", price: 325 },
      { item: "Eggs / chicken / fish / paneer", qty: "4 kg equiv.", rate: "₹290/kg", price: 1160 },
      { item: "Vegetables", qty: "12 kg", rate: "₹48/kg", price: 576 },
      { item: "Fruits", qty: "3 kg", rate: "₹95/kg", price: 285 },
      { item: "Curd + buttermilk", qty: "15 L", rate: "₹60/L", price: 900 },
      { item: "Makhana, seeds, green tea", qty: "800 g", rate: "₹620/kg", price: 496 },
    ],
    monthlyPrice: 3928,
    expertNote: "Weight loss faster than 1 kg/week is not a target here — rapid loss costs you muscle and rebounds.",
  },
];

export const getCondition = (slug: string) => conditions.find((c) => c.slug === slug);

export type Package = {
  id: string;
  name: string;
  price: number;
  original?: number;
  period: string;
  blurb: string;
  features: string[];
  featured?: boolean;
};

export const packages: Package[] = [
  {
    id: "plan-only",
    name: "Plan Only",
    price: 1499,
    original: 1999,
    period: "one month",
    blurb: "The full 30-day condition-specific plan with gram-level quantities and a shopping list.",
    features: [
      "30-day meal chart with exact quantities",
      "Weekly progression and swap options",
      "Printable grocery list with market rates",
      "1 dietitian chat review",
      "WhatsApp reminders",
    ],
  },
  {
    id: "plan-ration",
    name: "Plan + Ration Box",
    price: 5499,
    original: 6499,
    period: "one month",
    blurb: "Everything in Plan Only, plus the month's weighed groceries delivered to your door.",
    features: [
      "All Plan Only benefits",
      "Pre-weighed grains, dals, seeds and oils",
      "Two fresh produce deliveries per month",
      "Sourced at published market rates, zero markup on staples",
      "Free replacement for damaged items",
      "Two expert consultations",
    ],
    featured: true,
  },
  {
    id: "full-care",
    name: "Full Care",
    price: 8999,
    original: 10999,
    period: "one month",
    blurb: "Clinical supervision for complex cases — diabetes with kidney involvement, post-surgery, multiple conditions.",
    features: [
      "All Plan + Ration Box benefits",
      "Weekly 1:1 video consult with a clinical dietitian",
      "Lab report interpretation and plan revision",
      "Coordination notes for your treating doctor",
      "Daily WhatsApp support, 9 AM – 9 PM",
      "Family meal adaptation for one household",
    ],
  },
];

export type Expert = {
  name: string;
  role: string;
  focus: string;
  experience: string;
  initials: string;
};

export const experts: Expert[] = [
  { name: "Dr. Ananya Rao", role: "Clinical Dietitian, PhD", focus: "Diabetes, metabolic syndrome", experience: "14 years", initials: "AR" },
  { name: "Dr. Imran Sheikh", role: "Nephrology Dietitian", focus: "CKD, dialysis nutrition", experience: "11 years", initials: "IS" },
  { name: "Meera Krishnan", role: "Gut Health Specialist", focus: "IBS, low-FODMAP, SIBO", experience: "9 years", initials: "MK" },
  { name: "Dr. Sneha Patel", role: "Endocrine Nutritionist", focus: "PCOS, thyroid, fertility", experience: "12 years", initials: "SP" },
  { name: "Rahul Mehta", role: "Sports & Weight Management", focus: "Obesity, body recomposition", experience: "10 years", initials: "RM" },
  { name: "Dr. Kavita Nair", role: "Cardiac Dietitian", focus: "Hypertension, dyslipidaemia", experience: "16 years", initials: "KN" },
];
