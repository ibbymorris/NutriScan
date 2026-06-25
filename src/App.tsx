import React, { useState, useEffect } from 'react';
import { 
  Search, Star, ScanLine, User, Image as ImageIcon, History, Filter, 
  ChevronLeft, LayoutGrid, Camera, Focus, Plus, Check, ArrowRight, Home, 
  ShoppingBasket, Utensils, Diamond, AlertCircle, Clock, Info, ShieldAlert, 
  X, Zap, ZapOff, CalendarDays, Flame, Droplets, Target, Activity, Settings,
  Calculator, Banknote, RefreshCw, ShoppingCart, Circle, CheckCircle2,
  ChevronUp, SlidersHorizontal, Moon, ChevronRight, Copy, Award, Trophy, Medal, CloudLightning,
  GripVertical, MessageSquare, Sparkles, ChefHat, Heart, TrendingUp, Dumbbell, HeartPulse, ChevronsUpDown,
  Mic, Type, Share, Beef, Carrot, Milk, Wheat, ShoppingBag, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const triggerHaptic = (pattern: number | number[] = 12) => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      // ignore
    }
  }
};

const ProgressRing = ({ progress, colorClass }: { progress: number; colorClass: string }) => {
  const radius = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="transform -rotate-90 shrink-0">
      <circle 
        cx="8" cy="8" r={radius} 
        fill="none" 
        className="stroke-current opacity-25" 
        strokeWidth="3" 
      />
      <circle
        cx="8" cy="8" r={radius}
        fill="none"
        className={`stroke-current ${colorClass}`}
        strokeWidth="3"
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
      />
    </svg>
  );
};

interface BadgeProps {
  icon: React.ReactNode;
  text: string;
}

const Badge = ({ icon, text }: BadgeProps) => (
  <div className="flex items-center gap-1.5 px-2 py-1 bg-[#F2F2F7] rounded-[8px] text-[12px] font-medium text-[#3C3C43]">
    <span className="w-[14px] h-[14px] flex items-center justify-center text-[#8E8E93]">
      {icon}
    </span>
    <span>{text}</span>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState('scan'); 
  const [previousView, setPreviousView] = useState('scan');

  const handleNavigate = (view) => {
    setPreviousView(currentView);
    setCurrentView(view);
  };

  const [profiles, setProfiles] = useState([
    {
      id: '1', name: 'Alex Demo', goal: 'Build Muscle', bmi: 24.2, calorieIntake: 2850, proteinIntake: 180, healthScore: 85, color: 'from-gray-200 to-gray-300', icon: User,
      level: 12, xp: 1850, nextXp: 2000, 
      sleepData: { score: 68, duration: '5h 45m', adjustment: 'Low Recovery (+150 kcal)', calOffset: 150 },
      activityData: { steps: '4,230', caloriesBurned: '320' },
      badges: [
        { id: 1, name: '7 Day Streak', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', unlocked: true },
        { id: 2, name: 'Protein Master', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100', unlocked: true },
        { id: 3, name: 'Hydration Hero', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', unlocked: true },
        { id: 4, name: 'Early Riser', icon: Star, color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-100', unlocked: false }
      ]
    },
    {
      id: '2', name: 'Mia (Child 6yo)', goal: 'Healthy Growth', bmi: 15.5, calorieIntake: 1400, proteinIntake: 40, healthScore: 95, color: 'from-purple-200 to-purple-300', icon: User,
      level: 4, xp: 450, nextXp: 1000,
      sleepData: null,
      activityData: { steps: '8,400', caloriesBurned: '400' },
      badges: [
        { id: 1, name: 'Veggie Saver', icon: Star, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100', unlocked: true },
        { id: 2, name: 'Water Champion', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', unlocked: true }
      ]
    },
    {
      id: '3', name: 'Leo (Child 10yo)', goal: 'Active Sport', bmi: 18.2, calorieIntake: 2200, proteinIntake: 80, healthScore: 88, color: 'from-orange-200 to-orange-300', icon: User,
      level: 8, xp: 3200, nextXp: 4000,
      sleepData: null,
      activityData: { steps: '12,000', caloriesBurned: '800' },
      badges: [
        { id: 1, name: 'Iron Kid', icon: Award, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100', unlocked: true },
        { id: 2, name: 'Perfect Week', icon: Medal, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', unlocked: true }
      ]
    }
  ]);
  const [activeProfileId, setActiveProfileId] = useState('1');
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const handleSyncHealth = () => {
    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfileId) {
        return { 
          ...p, 
          sleepData: { score: 92, duration: '8h 20m', adjustment: 'Optimal Recovery', calOffset: 0 },
          activityData: { steps: '10,240', caloriesBurned: '680' } 
        };
      }
      return p;
    }));
  };

  const renderScreen = () => {
    switch (currentView) {
      case 'hero': return <HeroScreen onNext={() => handleNavigate('goals')} />;
      case 'goals': return <GoalSelectionScreen onBack={() => handleNavigate('hero')} onNext={() => handleNavigate('scan')} />;
      case 'scan': return <MainScanScreen onNavigate={handleNavigate} />;
      case 'scanning': return <ActiveScanScreen onComplete={() => handleNavigate('scan-result')} onCancel={() => handleNavigate('scan')} />;
      case 'scan-result': return <ScanResultScreen onBack={() => handleNavigate('scan')} />;
      case 'activity': return <ActivityScreen activeProfile={activeProfile} onSync={handleSyncHealth} onNavigate={handleNavigate} />;
      case 'sleep': return <SleepScreen activeProfile={activeProfile} onSync={handleSyncHealth} onNavigate={handleNavigate} />;
      case 'pantry': return <PantryScreen />;
      case 'meals': return <MealsScreen />;
      case 'plan': return <MealPlannerScreen onNavigate={handleNavigate} activeProfile={activeProfile} />;
      case 'pro': return <ProScreen onBack={() => handleNavigate('scan')} />;
      case 'rules': return <SettingsScreen onBack={() => handleNavigate(previousView)} activeProfile={activeProfile} onSync={handleSyncHealth} onNavigate={handleNavigate} initialTab="rules" />;
      case 'settings': return <SettingsScreen onBack={() => handleNavigate(previousView)} activeProfile={activeProfile} onSync={handleSyncHealth} onNavigate={handleNavigate} initialTab="menu" />;
      case 'missing': return <MissingProductScreen onBack={() => handleNavigate('scan')} />;
      case 'profile': return <ProfileScreen onNavigate={handleNavigate} profiles={profiles} setProfiles={setProfiles} activeProfileId={activeProfileId} setActiveProfileId={setActiveProfileId} activeProfile={activeProfile} />;
      case 'calculator': return <CalculatorScreen onBack={() => handleNavigate(previousView)} />;
      default: return <MainScanScreen onNavigate={handleNavigate} />;
    }
  };

  const showNav = ['scan', 'activity', 'sleep', 'plan', 'profile', 'pantry', 'meals', 'pro'].includes(currentView);

  return (
    <div className="min-h-screen bg-[#E5E5EA] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-gray-200">
      <div className="w-full max-w-[390px] h-[844px] max-h-[90vh] bg-white rounded-[44px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] overflow-hidden relative border-[8px] border-black flex flex-col">
        
        {/* Dynamic Island Placeholder */}
        <div className="absolute top-2 inset-x-0 h-7 flex justify-center z-50 pointer-events-none">
          <div className="w-[120px] h-7 bg-black rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar bg-white relative">
          {renderScreen()}
        </div>

        {showNav && <BottomNav currentView={currentView} onNavigate={handleNavigate} />}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .product-cutout {
          mix-blend-mode: multiply;
          filter: contrast(1.1);
        }
        
        .fade-mask { -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%); }
        .fade-mask-short { -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%); }
        
        @keyframes scan-sweep {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-sweep {
          animation: scan-sweep 2.5s ease-in-out infinite;
        }
        
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-soft {
          animation: pulse-soft 1.5s ease-in-out infinite;
        }

        @keyframes pop-check {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        .animate-pop-check {
          animation: pop-check 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }
        
        @keyframes particle-fade-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-30px, -30px) scale(0.3); opacity: 0; }
        }
        @keyframes particle-fade-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(30px, -30px) scale(0.3); opacity: 0; }
        }
        @keyframes particle-fade-3 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-35px, 15px) scale(0.3); opacity: 0; }
        }
        @keyframes particle-fade-4 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(35px, 15px) scale(0.3); opacity: 0; }
        }
        @keyframes particle-fade-5 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(0px, -40px) scale(0.3); opacity: 0; }
        }
        @keyframes particle-fade-6 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(15px, 35px) scale(0.3); opacity: 0; }
        }
        .animate-particle-1 { animation: particle-fade-1 0.8s cubic-bezier(0.1, 0.8, 0.25, 1) forwards; }
        .animate-particle-2 { animation: particle-fade-2 0.8s cubic-bezier(0.1, 0.8, 0.25, 1) forwards; }
        .animate-particle-3 { animation: particle-fade-3 0.8s cubic-bezier(0.1, 0.8, 0.25, 1) forwards; }
        .animate-particle-4 { animation: particle-fade-4 0.8s cubic-bezier(0.1, 0.8, 0.25, 1) forwards; }
        .animate-particle-5 { animation: particle-fade-5 0.8s cubic-bezier(0.1, 0.8, 0.25, 1) forwards; }
        .animate-particle-6 { animation: particle-fade-6 0.8s cubic-bezier(0.1, 0.8, 0.25, 1) forwards; }
      `}} />
    </div>
  );
}

// --- MEAL PLANNER SCREEN (UPGRADED FOR CONTROL & PROGRESSION) ---

function MealPlannerScreen({ onNavigate, activeProfile }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [activeDay, setActiveDay] = useState('Wed');
  const [swappingMealIndex, setSwappingMealIndex] = useState(null);
  const [swapFilter, setSwapFilter] = useState('All');
  const [maxPrepTime, setMaxPrepTime] = useState(45);
  const [maxCost, setMaxCost] = useState(10.0);
  const [minProtein, setMinProtein] = useState(10);
  const [pantryReadyOnly, setPantryReadyOnly] = useState(false);
  
  // State for collapsible filter panel and draft states
  const [showSwapFiltersPanel, setShowSwapFiltersPanel] = useState(false);
  const [draftSwapFilter, setDraftSwapFilter] = useState('All');
  const [draftMaxPrepTime, setDraftMaxPrepTime] = useState(45);
  const [draftMaxCost, setDraftMaxCost] = useState(10.0);
  const [draftMinProtein, setDraftMinProtein] = useState(10);
  const [draftPantryReadyOnly, setDraftPantryReadyOnly] = useState(false);

  // Quick Add Scan vs manual step
  const [quickAddStep, setQuickAddStep] = useState('select');
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [scannedAlertMessage, setScannedAlertMessage] = useState('');
  const [waterIntake, setWaterIntake] = useState(3);
  const [expandedMealIndex, setExpandedMealIndex] = useState(null);
  const [copiedGroceries, setCopiedGroceries] = useState(false);
  const [showGrocerySheet, setShowGrocerySheet] = useState(false);
  const [groceryGroupByAisle, setGroceryGroupByAisle] = useState(true);
  const [checkedGroceries, setCheckedGroceries] = useState({});
  const [clearedGroceries, setClearedGroceries] = useState({});
  const [lowProteinAlert, setLowProteinAlert] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [draggedMealIndex, setDraggedMealIndex] = useState(null);
  const [dragOverMealIndex, setDragOverMealIndex] = useState(null);
  const [moveToast, setMoveToast] = useState(null);
  const [eatenAnims, setEatenAnims] = useState({});
  const [optimizeForShortfalls, setOptimizeForShortfalls] = useState(false);
  const [completedIngredients, setCompletedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState('Snack');
  const [quickCals, setQuickCals] = useState('250');
  const [quickPro, setQuickPro] = useState('15');
  const [quickCarbs, setQuickCarbs] = useState('20');
  const [quickFat, setQuickFat] = useState('5');
  
  // AI and Export states
  const [isExporting, setIsExporting] = useState(false);
  const [grocerySortMode, setGrocerySortMode] = useState('Aisle'); // 'Aisle' or 'Freshness'
  const [clickAnim, setClickAnim] = useState({});

  useEffect(() => {
    if (swappingMealIndex !== null) {
      setDraftSwapFilter(swapFilter);
      setDraftMaxPrepTime(maxPrepTime);
      setDraftMaxCost(maxCost);
      setDraftMinProtein(minProtein);
      setDraftPantryReadyOnly(pantryReadyOnly);
      setShowSwapFiltersPanel(false);
    }
  }, [swappingMealIndex]);

  useEffect(() => {
    if (showQuickAdd) {
      setQuickAddStep('select');
      setIsScanningSimulated(false);
      setIsListening(false);
      setScannedAlertMessage('');
      setQuickTitle('');
      setQuickCategory('Snack');
      setQuickCals('250');
      setQuickPro('15');
      setQuickCarbs('20');
      setQuickFat('5');
    }
  }, [showQuickAdd]);

  // Advanced state with progression (eaten) and detailed macros/pantry status
  const [dayPlan, setDayPlan] = useState([
    { 
      id: 1, type: 'Breakfast', title: 'Greek Yoghurt & Berries', 
      cals: 320, pro: 28, carbs: 35, fat: 8,
      time: '5m', cost: '£1.20', missing: 0, totalIng: 4,
      eaten: true,
      img: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=300&q=80',
      ingredients: ['150g Greek Yoghurt', '50g Mixed Berries', '10g Honey', '20g Granola'],
      steps: ['Spoon yoghurt into a bowl.', 'Top with mixed berries.', 'Drizzle with honey and sprinkle granola.']
    },
    { 
      id: 2, type: 'Lunch', title: 'Grilled Chicken Salad', 
      cals: 450, pro: 42, carbs: 12, fat: 22,
      time: '15m', cost: '£3.50', missing: 1, totalIng: 6,
      eaten: false,
      img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
      ingredients: ['150g Chicken Breast', '100g Mixed Greens', '50g Cherry Tomatoes', '1/4 Avocado', '1tbsp Olive Oil', '1tbsp Balsamic Vinegar'],
      steps: ['Grill chicken until cooked through.', 'Slice chicken.', 'Toss greens, tomatoes, and chicken.', 'Dress with olive oil and vinegar.']
    },
    { 
      id: 3, type: 'Dinner', title: 'Wild Salmon & Quinoa', 
      cals: 580, pro: 48, carbs: 45, fat: 24,
      time: '25m', cost: '£5.80', missing: 3, totalIng: 5,
      eaten: false,
      img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300&q=80',
      ingredients: ['180g Salmon Fillet', '60g Quinoa', '100g Asparagus', '1/2 Lemon', '1tbsp Olive Oil'],
      steps: ['Preheat oven to 200°C.', 'Cook quinoa according to instructions.', 'Place salmon and asparagus on baking sheet.', 'Bake for 12-15 minutes.', 'Serve with a squeeze of lemon.']
    },
  ]);

  // Extended alternatives for the swap engine with granular data
  const swapAlternatives = [
    { 
      title: 'Steak & Sweet Potato', cals: 610, pro: 45, carbs: 40, fat: 28, 
      time: '20m', timeNum: 20, cost: '£6.50', costNum: 6.5, missing: 2, totalIng: 5, 
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80',
      ingredients: ['200g Sirloin Steak', '150g Sweet Potato', '100g Broccoli', '1tbsp Garlic Butter', 'Salt & Pepper'],
      steps: ['Cut sweet potato into wedges and bake at 200°C for 20m.', 'Season steak and sear on a hot skillet for 3-4m per side.', 'Steam broccoli for 4 minutes.', 'Let steak rest, then top with garlic butter and serve with sides.']
    },
    { 
      title: 'Lentil & Tofu Curry', cals: 520, pro: 38, carbs: 55, fat: 14, 
      time: '30m', timeNum: 30, cost: '£2.10', costNum: 2.1, missing: 0, totalIng: 8, 
      img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=300&q=80',
      ingredients: ['100g Red Lentils', '150g Firm Tofu', '100ml Coconut Milk Light', '1/2 Onion', '1 clove Garlic', '1tsp Curry Powder', '100g Spinach', '50g Brown Rice'],
      steps: ['Cook brown rice according to packet instructions.', 'Sauté diced onion and garlic in a pan with curry powder.', 'Add lentils, firm tofu, and coconut milk with 100ml of water.', 'Simmer for 15-20 minutes, then stir in fresh spinach until wilted.']
    },
    { 
      title: '10-Min Tuna Poke Bowl', cals: 550, pro: 42, carbs: 48, fat: 16, 
      time: '10m', timeNum: 10, cost: '£3.20', costNum: 3.2, missing: 1, totalIng: 6, 
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
      ingredients: ['1 can Canned Tuna in water', '75g Jasmine Rice', '1/2 Cucumber diced', '1/2 Carrot grated', '1tbsp Soy Sauce', '1tsp Sesame Oil'],
      steps: ['Warm up pre-cooked jasmine rice.', 'Drain tuna and place it in a serving bowl over rice.', 'Add cucumber slices and grated carrot.', 'Drizzle soy sauce and sesame oil. Mix and enjoy!']
    },
    { 
      title: 'Eggs & Avocado Toast', cals: 500, pro: 25, carbs: 32, fat: 28, 
      time: '5m', timeNum: 5, cost: '£1.80', costNum: 1.8, missing: 0, totalIng: 4, 
      img: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=300&q=80',
      ingredients: ['2 Large Eggs', '1 slice Sourdough Bread', '1/2 Avocado', 'Chili Flakes'],
      steps: ['Toast the sourdough slice.', 'Poach or fry the eggs to your preference.', 'Mash avocado onto the sourdough toast with salt & pepper.', 'Top with eggs and a pinch of chili flakes.']
    },
    { 
      title: 'Turkey & Spinach Wrap', cals: 380, pro: 32, carbs: 28, fat: 12, 
      time: '8m', timeNum: 8, cost: '£2.80', costNum: 2.8, missing: 0, totalIng: 4, 
      img: 'https://images.unsplash.com/photo-1626700051175-6518c4793f06?auto=format&fit=crop&w=300&q=80',
      ingredients: ['1 Whole Wheat Wrap', '120g Deli Turkey Slice', '50g Fresh Spinach', '1tbsp Hummus'],
      steps: ['Spread hummus evenly over the whole wheat wrap.', 'Layer turkey slices and fresh spinach on top.', 'Roll tightly and cut diagonally.', 'Serve immediately.']
    },
    { 
      title: 'Vegan Quinoa Salad', cals: 410, pro: 16, carbs: 58, fat: 11, 
      time: '12m', timeNum: 12, cost: '£2.20', costNum: 2.2, missing: 1, totalIng: 5, 
      img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=300&q=80',
      ingredients: ['80g Cooked Quinoa', '50g Black Beans canned', '1/2 Red Bell Pepper', '1/2 Avocado', 'Lime Juice & Cilantro'],
      steps: ['In a salad bowl, combine cooked quinoa and rinsed black beans.', 'Add diced red bell pepper and diced avocado.', 'Squeeze fresh lime juice over the salad.', 'Toss with chopped cilantro and season to taste.']
    },
    { 
      title: 'Beef & Broccoli Stir-Fry', cals: 510, pro: 40, carbs: 24, fat: 22, 
      time: '18m', timeNum: 18, cost: '£4.80', costNum: 4.8, missing: 2, totalIng: 6, 
      img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80',
      ingredients: ['150g Lean Beef strips', '150g Broccoli florets', '1tbsp Soy Sauce', '1tsp Ginger minced', '1tsp Sesame Seeds', '1tbsp Vegetable Oil'],
      steps: ['Heat vegetable oil in a wok or large pan over high heat.', 'Add beef strips and sauté for 4-5 minutes until browned.', 'Add broccoli florets, minced ginger, and soy sauce.', 'Stir-fry for another 5 minutes, then garnish with sesame seeds.']
    },
    { 
      title: 'Smoked Salmon Poke Bowl', cals: 590, pro: 35, carbs: 50, fat: 26, 
      time: '15m', timeNum: 15, cost: '£7.50', costNum: 7.5, missing: 3, totalIng: 7, 
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
      ingredients: ['100g Smoked Salmon', '80g Sushi Rice', '50g Edamame shelled', '1/2 Avocado', 'Pickled Ginger', 'Soy Sauce', 'Sriracha Mayo'],
      steps: ['Prepare sushi rice according to directions and let cool slightly.', 'Arrange smoked salmon, edamame, and avocado slices over rice.', 'Add pickled ginger.', 'Drizzle with soy sauce and a touch of sriracha mayo before serving.']
    },
    { 
      title: 'Spiced Chickpea Salad', cals: 460, pro: 18, carbs: 62, fat: 12, 
      time: '10m', timeNum: 10, cost: '£1.50', costNum: 1.5, missing: 0, totalIng: 5, 
      img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
      ingredients: ['1 can Chickpeas rinsed', '1/2 Cucumber diced', '1 Tomato chopped', '1/4 Red Onion', 'Lemon Juice & Olive Oil'],
      steps: ['Rinse and drain canned chickpeas thoroughly.', 'Toss chickpeas, diced cucumber, chopped tomato, and red onion in a bowl.', 'Drizzle olive oil and fresh lemon juice.', 'Season with salt, pepper, and optional parsley.']
    }
  ];

  const filteredSwaps = swapAlternatives.filter(alt => {
    if (alt.timeNum > maxPrepTime) return false;
    if (alt.costNum > maxCost) return false;
    if (alt.pro < minProtein) return false;
    if (pantryReadyOnly && alt.missing > 0) return false;
    return true;
  });

  // Progression Calculations
  const targetCals = activeProfile ? activeProfile.calorieIntake + (activeProfile.sleepData?.calOffset || 0) : 1850;
  const targetPro = activeProfile ? activeProfile.proteinIntake : 150;
  
  const consumedCals = dayPlan.filter(m => m.eaten).reduce((acc, m) => acc + m.cals, 0);
  const consumedPro = dayPlan.filter(m => m.eaten).reduce((acc, m) => acc + m.pro, 0);
  const consumedCarbs = dayPlan.filter(m => m.eaten).reduce((acc, m) => acc + (m.carbs || 0), 0);
  const consumedFat = dayPlan.filter(m => m.eaten).reduce((acc, m) => acc + (m.fat || 0), 0);

  const targetCarbs = activeProfile ? (activeProfile.id === '1' ? 265 : activeProfile.id === '2' ? 120 : 180) : 265;
  const targetFat = activeProfile ? (activeProfile.id === '1' ? 65 : activeProfile.id === '2' ? 35 : 50) : 65;
  
  const calsPercent = Math.min((consumedCals / targetCals) * 100, 100);
  const proPercent = Math.min((consumedPro / targetPro) * 100, 100);
  const carbsPercent = Math.min((consumedCarbs / targetCarbs) * 100, 100);
  const fatPercent = Math.min((consumedFat / targetFat) * 100, 100);
  const proteinShortfall = Math.max(0, targetPro - consumedPro);

  const toggleEaten = (index) => {
    const newPlan = [...dayPlan];
    const meal = newPlan[index];
    const isEatenNow = !meal.eaten;
    meal.eaten = isEatenNow;
    setDayPlan(newPlan);

    // Subtle premium haptic feedback
    if (isEatenNow) {
      triggerHaptic([15, 30, 10]); // double-tap physical feel
    } else {
      triggerHaptic(10); // subtle physical tap
    }

    if (isEatenNow) {
      setEatenAnims(prev => ({ ...prev, [meal.id]: Date.now() }));
      setTimeout(() => {
        setEatenAnims(prev => {
          const updated = { ...prev };
          delete updated[meal.id];
          return updated;
        });
      }, 1200);

      if (meal.pro < 30) {
        setLowProteinAlert({ id: meal.id, title: meal.title });
      } else if (lowProteinAlert?.id === meal.id) {
        setLowProteinAlert(null);
      }
    } else {
      if (lowProteinAlert?.id === meal.id) {
        setLowProteinAlert(null);
      }
    }
  };

  const handleSwap = (altMeal) => {
    if (swappingMealIndex === null) return;
    const newPlan = [...dayPlan];
    const currentMeal = newPlan[swappingMealIndex];
    
    newPlan[swappingMealIndex] = {
      ...currentMeal,
      title: altMeal.title,
      cals: altMeal.cals,
      pro: altMeal.pro,
      carbs: altMeal.carbs || 30,
      fat: altMeal.fat || 12,
      time: altMeal.time,
      cost: altMeal.cost,
      missing: altMeal.missing,
      img: altMeal.img,
      ingredients: altMeal.ingredients || [
        `1 Portion of ${altMeal.title}`,
        'Fresh seasoning & garnish'
      ],
      steps: altMeal.steps || [
        `Prepare the fresh ${altMeal.title}.`,
        'Cook to optimal temperature.',
        'Serve hot and enjoy!'
      ]
    };
    
    setDayPlan(newPlan);
    setSwappingMealIndex(null);
  };

  const handleAddOffPlanMeal = (e) => {
    e.preventDefault();
    const newId = Math.max(...dayPlan.map(m => m.id), 0) + 1;
    const newMeal = {
      id: newId,
      type: quickCategory,
      title: quickTitle.trim() || 'Custom Off-Plan',
      cals: Number(quickCals) || 0,
      pro: Number(quickPro) || 0,
      carbs: Number(quickCarbs) || 0,
      fat: Number(quickFat) || 0,
      time: '5m',
      cost: '£1.50',
      missing: 0,
      totalIng: 1,
      eaten: true,
      offPlan: true,
      img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=300&q=80',
      ingredients: ['1 serving of ' + (quickTitle.trim() || 'Custom food item')],
      steps: ['Squeeze in or consume your custom tracked off-plan food.', 'Log complete!']
    };
    
    setDayPlan([...dayPlan, newMeal]);
    
    setQuickTitle('');
    setQuickCategory('Snack');
    setQuickCals('250');
    setQuickPro('15');
    setQuickCarbs('20');
    setQuickFat('5');
    
    setShowQuickAdd(false);
  };

  const getMissingIngredientsForMeal = (meal) => {
    if (meal.missing === 0) return [];
    const title = meal.title.toLowerCase();
    if (title.includes('chicken salad') || title.includes('chicken')) {
      return ['150g Chicken Breast', '50g Cherry Tomatoes'];
    }
    if (title.includes('salmon')) {
      return ['180g Salmon Fillet', '100g Asparagus', '1/2 Lemon'];
    }
    if (title.includes('steak')) {
      return ['200g Sirloin Steak', '150g Sweet Potato'];
    }
    if (title.includes('tuna')) {
      return ['1 can of Tuna', '50g Sweetcorn'];
    }
    return (meal.ingredients || []).slice(0, meal.missing);
  };

  const getAisleForIngredient = (ingredient) => {
    const lower = ingredient.toLowerCase();
    if (lower.includes('chicken') || lower.includes('salmon') || lower.includes('steak') || lower.includes('tuna') || lower.includes('beef') || lower.includes('pork') || lower.includes('tofu') || lower.includes('turkey') || lower.includes('fish') || lower.includes('eggs')) {
      return 'Proteins';
    }
    if (lower.includes('yoghurt') || lower.includes('yogurt') || lower.includes('cheese') || lower.includes('milk') || lower.includes('butter') || lower.includes('cream')) {
      return 'Dairy';
    }
    if (lower.includes('tomatoes') || lower.includes('greens') || lower.includes('salad') || lower.includes('lettuce') || lower.includes('spinach') || lower.includes('asparagus') || lower.includes('lemon') || lower.includes('avocado') || lower.includes('berries') || lower.includes('potato') || lower.includes('lime') || lower.includes('cucumber') || lower.includes('pepper') || lower.includes('garlic') || lower.includes('onion') || lower.includes('sweetcorn')) {
      return 'Produce';
    }
    if (lower.includes('quinoa') || lower.includes('rice') || lower.includes('granola') || lower.includes('honey') || lower.includes('oil') || lower.includes('vinegar') || lower.includes('seasoning') || lower.includes('curry') || lower.includes('lentil') || lower.includes('toast') || lower.includes('oats') || lower.includes('bread') || lower.includes('pasta')) {
      return 'Grains & Pantry';
    }
    return 'Other Aisle';
  };

  const handleExportGroceries = () => {
    let exportText = '';
    const missingItems = [];
    
    filteredDayPlan.forEach(meal => {
      const missingIngs = getMissingIngredientsForMeal(meal);
      missingIngs.forEach(ing => {
        if (!clearedGroceries[ing]) {
          missingItems.push({
            name: ing,
            mealTitle: meal.title,
            aisle: getAisleForIngredient(ing)
          });
        }
      });
    });

    const totalCostStr = (missingItems.length * 2.12).toFixed(2);

    if (groceryGroupByAisle) {
      const grouped = {};
      missingItems.forEach(item => {
        if (!grouped[item.aisle]) grouped[item.aisle] = [];
        grouped[item.aisle].push(item.name);
      });

      exportText = `Grocery List (Estimated £${totalCostStr}) - Grouped by Aisle:\n\n`;
      Object.keys(grouped).forEach(aisle => {
        exportText += `📍 ${aisle}:\n`;
        grouped[aisle].forEach(ing => {
          const isChecked = !!checkedGroceries[ing];
          exportText += `${isChecked ? '[x]' : '[ ]'} ${ing}\n`;
        });
        exportText += `\n`;
      });
    } else {
      const grouped = {};
      missingItems.forEach(item => {
        if (!grouped[item.mealTitle]) grouped[item.mealTitle] = [];
        grouped[item.mealTitle].push(item.name);
      });

      exportText = `Grocery List (Estimated £${totalCostStr}) - Grouped by Meal:\n\n`;
      Object.keys(grouped).forEach(mealTitle => {
        exportText += `🍽️ ${mealTitle}:\n`;
        grouped[mealTitle].forEach(ing => {
          const isChecked = !!checkedGroceries[ing];
          exportText += `${isChecked ? '[x]' : '[ ]'} ${ing}\n`;
        });
        exportText += `\n`;
      });
    }

    exportText += `Generated by AI Studio`;

    navigator.clipboard.writeText(exportText).then(() => {
      setCopiedGroceries(true);
      setTimeout(() => setCopiedGroceries(false), 2000);
    });
  };

  const showHydrationPrompt = new Date().getHours() >= 14 && waterIntake < 5;

  const getDifficulty = (meal) => {
    const total = meal.totalIng + meal.steps.length;
    if (total >= 9) return { label: 'Hard', color: 'bg-red-50 text-red-600' };
    if (total >= 7) return { label: 'Medium', color: 'bg-amber-50 text-amber-600' };
    return { label: 'Easy', color: 'bg-emerald-50 text-emerald-600' };
  };

  const handleDragStart = (e, index) => {
    setDraggedMealIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverCard = (e, index) => {
    e.preventDefault();
    if (draggedMealIndex !== index) {
      setDragOverMealIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedMealIndex(null);
    setDragOverMealIndex(null);
  };

  const handleDropOnCard = (e, index) => {
    e.preventDefault();
    if (draggedMealIndex === null || draggedMealIndex === index) return;

    const newPlan = [...dayPlan];
    const draggedItem = newPlan[draggedMealIndex];
    newPlan.splice(draggedMealIndex, 1);
    newPlan.splice(index, 0, draggedItem);

    setDayPlan(newPlan);
    setDraggedMealIndex(null);
    setDragOverMealIndex(null);
  };

  const handleDropOnDay = (e, targetDay) => {
    e.preventDefault();
    if (draggedMealIndex === null) return;

    const draggedMeal = dayPlan[draggedMealIndex];
    const fullDaysMap = {
      'Mon': 'Monday',
      'Tue': 'Tuesday',
      'Wed': 'Wednesday',
      'Thu': 'Thursday',
      'Fri': 'Friday',
      'Sat': 'Saturday',
      'Sun': 'Sunday'
    };
    
    setMoveToast({
      mealTitle: draggedMeal.title,
      day: fullDaysMap[targetDay] || targetDay
    });

    const newPlan = dayPlan.filter((_, idx) => idx !== draggedMealIndex);
    setDayPlan(newPlan);

    setDraggedMealIndex(null);
    setDragOverMealIndex(null);

    setTimeout(() => {
      setMoveToast(null);
    }, 4500);
  };

  const filteredDayPlan = dayPlan;

  const handleExportPDF = async () => {
    setIsExporting(true);
    triggerHaptic();
    try {
      // Lazy load html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('meal-plan-content');
      
      const opt = {
        margin: 10,
        filename: 'Weekly_Meal_Plan.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error("PDF Export failed", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative animate-in fade-in duration-500 pb-24" id="meal-plan-content">
      
      <div className="px-6 pt-16 pb-2 flex items-center justify-between sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-md z-20">
        <h1 className="text-[20px] font-medium tracking-tight text-black">Meal Plan</h1>
        <div className="flex gap-2">
          <button onClick={handleExportPDF} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-black hover:bg-gray-200 transition-colors" title="Share PDF">
            {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share className="w-4 h-4" strokeWidth={2} />}
          </button>
          <button onClick={() => onNavigate('rules')} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-black hover:bg-gray-200 transition-colors">
            <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        
        {/* Day Selector */}
        <div className="px-6 py-4 flex justify-between items-center mb-2">
          {days.map((day) => (
            <button 
              key={day} 
              onClick={() => setActiveDay(day)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnDay(e, day)}
              className={`flex flex-col items-center justify-center w-10 h-12 rounded-[14px] transition-all relative ${
                activeDay === day 
                  ? 'bg-black text-white shadow-md' 
                  : draggedMealIndex !== null 
                    ? 'border-2 border-dashed border-black/40 text-black bg-black/5 animate-pulse scale-105'
                    : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <span className={`text-[12px] font-medium ${activeDay === day ? 'text-white' : 'text-gray-500'}`}>{day.charAt(0)}</span>
              {/* Dot indicator if day is fully planned */}
              <div className={`w-1 h-1 rounded-full mt-1 ${activeDay === day ? 'bg-white/50' : 'bg-gray-200'}`}></div>
            </button>
          ))}
        </div>

        {/* Dynamic Progression Header */}
        <div className="px-6 mb-6">
          <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            
            {/* Calories & Custom Add button Row */}
            <div className="flex justify-between items-start mb-6 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-1 text-gray-400 font-bold tracking-tight text-[12px] uppercase mb-1">
                  <span>Calories eaten</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300" />
                </div>
                <div className="text-[38px] font-black tracking-tighter text-black leading-none">
                  {consumedCals}
                  <span className="text-[20px] text-gray-400 font-bold ml-1.5">kcal</span>
                </div>
              </div>
              
              {/* Circular Premium Add Button with Interactive Purple Calorie Progress Rim */}
              <div className="relative w-[60px] h-[60px] shrink-0">
                <svg width="60" height="60" className="absolute inset-0 -rotate-90">
                  {/* Track ring */}
                  <circle 
                    cx="30" 
                    cy="30" 
                    r="26" 
                    fill="none" 
                    stroke="#2C2C2E" 
                    strokeWidth="3.5" 
                  />
                  {/* Progress ring in premium purple */}
                  <circle 
                    cx="30" 
                    cy="30" 
                    r="26" 
                    fill="none" 
                    stroke="#9D9CFF" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    strokeDasharray="163.36"
                    strokeDashoffset={163.36 - (163.36 * calsPercent) / 100}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                {/* Embedded button */}
                <button 
                  onClick={() => {
                    setShowQuickAdd(true);
                    triggerHaptic(15);
                  }}
                  id="meal-plan-add-button"
                  className="absolute top-[4px] left-[4px] w-[52px] h-[52px] rounded-full bg-[#1C1C1E] hover:bg-black active:scale-95 transition-all flex items-center justify-center text-white cursor-pointer group shadow-md"
                  title="Log Food (Quick Add)"
                >
                  <Plus className="w-6 h-6 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Macro Breakdown (Carbs, Fats, Proteins with circular dots, progress bars, and dual-colored labels) */}
            <div className="grid grid-cols-3 gap-3 border-t border-gray-50 pt-4">
              {/* Carbs column */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#F1A93B]" />
                  <span className="text-[12px] font-bold text-gray-400">Carbs</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F1A93B] transition-all duration-700" style={{ width: `${carbsPercent}%` }} />
                </div>
                <div className="text-[13px] font-medium text-gray-400">
                  <span className="font-extrabold text-black">{consumedCarbs}</span>/{targetCarbs} g
                </div>
              </div>

              {/* Fats column */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#3F82F7]" />
                  <span className="text-[12px] font-bold text-gray-400">Fats</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#3F82F7] transition-all duration-700" style={{ width: `${fatPercent}%` }} />
                </div>
                <div className="text-[13px] font-medium text-gray-400">
                  <span className="font-extrabold text-black">{consumedFat}</span>/{targetFat} g
                </div>
              </div>

              {/* Proteins column */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#4CD964]" />
                  <span className="text-[12px] font-bold text-gray-400">Proteins</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4CD964] transition-all duration-700" style={{ width: `${proPercent}%` }} />
                </div>
                <div className="text-[13px] font-medium text-gray-400">
                  <span className="font-extrabold text-black">{consumedPro}</span>/{targetPro} g
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Meal Cards with Granular Control */}
        <div className="px-6 space-y-4 pb-8">
          {consumedCals > targetCals && (
            <div className="bg-red-50 border border-red-100 rounded-[24px] p-4 flex items-start gap-3 mb-2 animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 shadow-sm border border-red-50">
                <Flame className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 mt-0.5">
                <h4 className="text-[14px] font-medium text-red-900 mb-0.5">Calorie Limit Exceeded</h4>
                <p className="text-[13px] text-red-800/80 font-light leading-snug">You are {consumedCals - targetCals} kcal over your daily target.</p>
              </div>
            </div>
          )}
          {consumedPro > targetPro && (
            <div className="bg-orange-50 border border-orange-100 rounded-[24px] p-4 flex items-start gap-3 mb-2 animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 shadow-sm border border-orange-50">
                <Activity className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1 mt-0.5">
                <h4 className="text-[14px] font-medium text-orange-900 mb-0.5">Protein Goal Hit</h4>
                <p className="text-[13px] text-orange-800/80 font-light leading-snug">Awesome! You've exceeded your daily {targetPro}g protein target.</p>
              </div>
            </div>
          )}
          {lowProteinAlert && (
            <div className="bg-amber-50 border border-amber-100 rounded-[24px] p-4 flex items-start gap-3 mb-2 animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 shadow-sm border border-amber-50">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 mt-0.5">
                <div className="flex justify-between items-start mb-0.5">
                   <h4 className="text-[14px] font-medium text-amber-900">Low Protein Logged</h4>
                   <button onClick={() => setLowProteinAlert(null)}><X className="w-4 h-4 text-amber-700"/></button>
                </div>
                <p className="text-[13px] text-amber-800/80 font-light leading-snug">'{lowProteinAlert.title}' is a bit low in protein. Add a side like Greek Yoghurt or swap for higher protein alternatives?</p>
                <div className="mt-3 flex gap-2">
                   <button onClick={() => { setSwappingMealIndex(dayPlan.findIndex(m => m.id === lowProteinAlert.id)); setLowProteinAlert(null); }} className="bg-white text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-amber-100 transition-colors">Swap Meal</button>
                   <button onClick={() => { setShowQuickAdd(true); setLowProteinAlert(null); }} className="bg-white text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-amber-100 transition-colors">Quick Add Snack</button>
                </div>
              </div>
            </div>
          )}
          {showHydrationPrompt && (
            <div className="bg-blue-50 border border-blue-100 rounded-[24px] p-4 flex items-start gap-3 mb-2 animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 shadow-sm border border-blue-50">
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 mt-0.5">
                <h4 className="text-[14px] font-medium text-blue-900 mb-0.5">Hydration Alert</h4>
                <p className="text-[13px] text-blue-800/80 font-light leading-snug">It's past 2 PM and you're under 5 glasses. Drink some water to stay energized!</p>
              </div>
            </div>
          )}
          <motion.div 
            key={activeDay}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-4"
            >
              {filteredDayPlan.map((meal, index) => {
                const actualIndex = dayPlan.findIndex(m => m.id === meal.id);
                const isDragging = draggedMealIndex === actualIndex;
                const isOver = dragOverMealIndex === actualIndex;
                return (
                <div 
                  key={meal.id} 
                  draggable
                  onDragStart={(e) => {
                    // If target is a button or inside one, don't drag
                    if (e.target.closest('button')) {
                      e.preventDefault();
                      return;
                    }
                    handleDragStart(e, actualIndex);
                  }}
                  onDragOver={(e) => handleDragOverCard(e, actualIndex)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDropOnCard(e, actualIndex)}
                  className={`bg-white border rounded-[28px] p-4 sm:p-5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] relative overflow-hidden transition-all duration-300 cursor-grab active:cursor-grabbing select-none ${
                    isDragging 
                      ? 'opacity-30 scale-95 border-dashed border-gray-400' 
                      : isOver 
                        ? 'border-black border-2 scale-[1.02] shadow-md' 
                        : meal.eaten 
                          ? 'border-gray-200 opacity-80' 
                          : 'border-black/[0.03] hover:border-gray-300'
                  }`}
                >
                  
                  <div className="flex items-start gap-3 w-full relative z-10">
                    
                    {/* Left Column: Drag Handle & Selection */}
                    <div className="flex flex-col items-center pt-1.5 gap-4 shrink-0">
                      <div className="relative">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            toggleEaten(actualIndex); 
                            setClickAnim(prev => ({...prev, [meal.id]: true}));
                            setTimeout(() => setClickAnim(prev => ({...prev, [meal.id]: false})), 500);
                          }} 
                          className={`active:scale-90 transition-transform block ${eatenAnims[meal.id] ? 'animate-pop-check' : ''}`}
                        >
                          {meal.eaten ? (
                            <motion.div
                              animate={clickAnim[meal.id] ? { scale: [1, 1.3, 0.9, 1], rotate: [0, -10, 10, 0] } : {}}
                              transition={{ duration: 0.4 }}
                            >
                              <CheckCircle2 className="w-[22px] h-[22px] text-black" strokeWidth={1.5} />
                            </motion.div>
                          ) : (
                            <Circle className="w-[22px] h-[22px] text-gray-300 hover:text-black transition-colors" strokeWidth={1.5} />
                          )}
                        </button>
                        
                        {/* Celebration micro-confetti burst */}
                        {eatenAnims[meal.id] && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-orange-400 absolute animate-particle-1"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 absolute animate-particle-2"></span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute animate-particle-3"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 absolute animate-particle-4"></span>
                            <span className="w-2 h-2 rounded-full bg-indigo-500 absolute animate-particle-5"></span>
                            <span className="w-1 h-1 rounded-full bg-pink-500 absolute animate-particle-6"></span>
                          </div>
                        )}
                      </div>
                      <GripVertical className="w-5 h-5 text-[#D1D1D6] cursor-grab active:cursor-grabbing" strokeWidth={1.5} />
                    </div>

                    {/* Right Column: Main Content */}
                    <div className="flex-1 flex flex-col pt-0.5 min-w-0">
                      
                      {/* Header Area: Text + Image */}
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="text-[10px] font-bold tracking-[0.12em] text-[#8E8E93] uppercase">
                              {meal.type}
                            </span>
                            {meal.offPlan && (
                              <span className="bg-orange-100 text-orange-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Off-Plan Logged</span>
                            )}
                          </div>
                          <h3 className={`text-[20px] font-bold leading-[1.15] tracking-tight mt-1 transition-colors ${meal.eaten ? 'text-gray-400 line-through' : 'text-[#1C1C1E]'}`}>
                            {meal.title}
                          </h3>
                          
                          {/* Macros - Structured Typography */}
                          <div className="text-[28px] font-black tracking-tight text-black leading-none mt-2">
                            {meal.cals}
                            <span className="text-[14px] text-gray-400 font-bold ml-1">kcal</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#4CD964]" />
                              <span className="text-[12px] font-medium text-gray-400">
                                Protein: <span className="font-extrabold text-[#1C1C1E]">{meal.pro || 0}g</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#F1A93B]" />
                              <span className="text-[12px] font-medium text-gray-400">
                                Carbs: <span className="font-extrabold text-[#1C1C1E]">{meal.carbs || 0}g</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#3F82F7]" />
                              <span className="text-[12px] font-medium text-gray-400">
                                Fat: <span className="font-extrabold text-[#1C1C1E]">{meal.fat || 0}g</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Image - iOS Standard Rounded Square */}
                        <div className={`relative w-[80px] h-[80px] sm:w-[88px] sm:h-[88px] shrink-0 transition-all duration-500 ${meal.eaten ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                          <img 
                            src={meal.img} 
                            alt={meal.title} 
                            className="w-full h-full object-cover rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]" 
                          />
                          {/* Subtle inner ring for premium feel */}
                          <div className="absolute inset-0 rounded-[20px] ring-1 ring-inset ring-black/10 pointer-events-none" />
                        </div>
                      </div>

                      {/* Tags / Metadata Layer */}
                      <div className="flex flex-wrap items-center gap-2 mt-4">
                         <Badge icon={<Clock className="w-3.5 h-3.5" />} text={meal.time} />
                         <Badge icon={<Banknote className="w-3.5 h-3.5" />} text={meal.cost} />
                         
                         {/* Dynamic Pantry Status Tag */}
                         {meal.missing === 0 ? (
                            <div className="flex items-center gap-1.5 bg-[#34C759]/10 text-[#248A3D] px-2.5 py-1 rounded-[8px] text-[12px] font-semibold">
                               <div className="w-[14px] h-[14px] bg-[#34C759] rounded-full flex items-center justify-center text-white">
                                 <Check className="w-2.5 h-2.5" />
                               </div>
                               In Pantry
                            </div>
                         ) : (
                            <div className="flex items-center gap-1.5 bg-[#FF9500]/10 text-[#C16B00] px-2.5 py-1 rounded-[8px] text-[12px] font-semibold">
                               <ProgressRing progress={Math.round(((meal.totalIng - meal.missing) / meal.totalIng) * 100)} colorClass="text-[#FF9500]" />
                               Buy {meal.missing}/{meal.totalIng}
                            </div>
                         )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2.5 mt-5">
                         {!meal.eaten && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSwappingMealIndex(actualIndex);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] py-2.5 rounded-[12px] text-[14px] font-semibold transition-colors animate-in fade-in"
                            >
                               <RefreshCw className="w-[18px] h-[18px] text-[#8E8E93]" />
                               Swap
                            </button>
                         )}
                         <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedMealIndex(actualIndex);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] py-2.5 rounded-[12px] text-[14px] font-semibold transition-colors"
                         >
                            <ChefHat className="w-[18px] h-[18px] text-[#8E8E93]" />
                            Recipe
                         </button>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
            </motion.div>

          {filteredDayPlan.length === 0 && (
            <div className="bg-white border border-gray-150 rounded-[28px] p-8 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-4 animate-in fade-in duration-300">
              <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <h3 className="text-[15px] font-medium text-black mb-1">No meals scheduled</h3>
              <p className="text-[12px] text-gray-400 max-w-[220px] mx-auto mb-4">All meals have been eaten, searched away, or moved to another day.</p>
              <button 
                onClick={() => {
                  setDayPlan([
                    { 
                      id: 1, type: 'Breakfast', title: 'Greek Yoghurt & Berries', 
                      cals: 320, pro: 28, carbs: 35, fat: 8,
                      time: '5m', cost: '£1.20', missing: 0, totalIng: 4,
                      eaten: false,
                      img: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=300&q=80',
                      ingredients: ['150g Greek Yoghurt', '50g Mixed Berries', '10g Honey', '20g Granola'],
                      steps: ['Spoon yoghurt into a bowl.', 'Top with mixed berries.', 'Drizzle with honey and sprinkle granola.']
                    },
                    { 
                      id: 2, type: 'Lunch', title: 'Grilled Chicken Salad', 
                      cals: 450, pro: 42, carbs: 12, fat: 22,
                      time: '15m', cost: '£3.50', missing: 1, totalIng: 6,
                      eaten: false,
                      img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
                      ingredients: ['150g Chicken Breast', '100g Mixed Greens', '50g Cherry Tomatoes', '1/4 Avocado', '1tbsp Olive Oil', '1tbsp Balsamic Vinegar'],
                      steps: ['Grill chicken until cooked through.', 'Slice chicken.', 'Toss greens, tomatoes, and chicken.', 'Dress with olive oil and vinegar.']
                    },
                    { 
                      id: 3, type: 'Dinner', title: 'Wild Salmon & Quinoa', 
                      cals: 580, pro: 48, carbs: 45, fat: 24,
                      time: '25m', cost: '£5.80', missing: 3, totalIng: 5,
                      eaten: false,
                      img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300&q=80',
                      ingredients: ['180g Salmon Fillet', '60g Quinoa', '100g Asparagus', '1/2 Lemon', '1tbsp Olive Oil'],
                      steps: ['Preheat oven to 200°C.', 'Cook quinoa according to instructions.', 'Place salmon and asparagus on baking sheet.', 'Bake for 12-15 minutes.', 'Serve with a squeeze of lemon.']
                    },
                  ]);
                }} 
                className="px-4 py-2 bg-black text-white rounded-full text-[12px] font-medium hover:bg-gray-800 transition-colors"
              >
                Reset Meal Plan
              </button>
            </div>
          )}

          {/* Actionable Grocery Tie-in */}
          {(() => {
            let actualMissingCount = 0;
            filteredDayPlan.forEach(meal => {
              const missingIngs = getMissingIngredientsForMeal(meal);
              missingIngs.forEach(ing => {
                if (!clearedGroceries[ing]) actualMissingCount++;
              });
            });
            const estCost = (actualMissingCount * 2.12).toFixed(2);
            return (
              <div 
                onClick={() => setShowGrocerySheet(true)}
                className="bg-[#F7F7F9] rounded-[24px] p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform group"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                      <ShoppingBag className="w-[20px] h-[20px] text-black" strokeWidth={2} />
                    </div>
                    <div>
                       <h3 className="text-[15px] font-semibold text-black tracking-tight">Shopping List</h3>
                       <div className="text-[13px] text-gray-500 font-medium mt-0.5">
                         {actualMissingCount} items • ~£{estCost}
                       </div>
                    </div>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:bg-gray-50 transition-colors">
                   <ChevronRight className="w-4 h-4 text-black" strokeWidth={2.5} />
                 </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* RECIPE DETAILS BOTTOM SHEET */}
      {expandedMealIndex !== null && filteredDayPlan[expandedMealIndex] && (() => {
        const meal = filteredDayPlan[expandedMealIndex];
        return (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 cursor-pointer" 
              onClick={() => setExpandedMealIndex(null)}
            ></motion.div>
            <motion.div 
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="absolute bottom-0 inset-x-0 bg-white rounded-t-[40px] z-50 p-6 pt-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-12 flex flex-col max-h-[85vh]"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 shrink-0"></div>
              
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 block mb-0.5">{meal.type}</span>
                  <h2 className="text-[20px] font-medium tracking-tight text-black leading-snug">{meal.title}</h2>
                </div>
                <button onClick={() => setExpandedMealIndex(null)} className="text-black hover:text-gray-600 transition-colors bg-gray-100 p-2 rounded-full shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-[13px] text-gray-500 mb-5 shrink-0 bg-gray-50 py-2.5 px-4 rounded-2xl border border-gray-100">
                <span className="font-semibold text-black">{meal.cals} <span className="font-light text-gray-400">kcal</span></span>
                <span className="text-gray-300">·</span>
                <span className="font-semibold text-black">{meal.pro}g <span className="font-light text-gray-400">Protein</span></span>
                <span className="text-gray-300">·</span>
                <span className="font-semibold text-black">{meal.carbs}g <span className="font-light text-gray-400">Carbs</span></span>
                <span className="text-gray-300">·</span>
                <span className="font-semibold text-black">{meal.fat}g <span className="font-light text-gray-400">Fat</span></span>
              </div>

              <div className="space-y-4 overflow-y-auto hide-scrollbar flex-1 pb-4 pr-1">


                {/* Ingredients section */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <h4 className="text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-3 flex items-center gap-1.5">
                    <ShoppingBasket className="w-3.5 h-3.5" /> Ingredients
                  </h4>
                  <ul className="space-y-2">
                    {meal.ingredients.map((ing, i) => (
                      <li key={i} className="text-[13px] text-gray-700 flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0"></span>
                        <span className="leading-tight">{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions section */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <h4 className="text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-3 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5" /> Instructions
                  </h4>
                  <ol className="space-y-3.5 relative">
                    <div className="absolute top-2 bottom-2 left-[7px] w-px bg-gray-200"></div>
                    {meal.steps.map((step, i) => (
                      <li key={i} className="text-[13px] text-gray-700 flex items-start gap-3 relative z-10">
                        <span className="flex items-center justify-center w-[15px] h-[15px] rounded-full bg-white border-2 border-gray-200 text-transparent shrink-0 mt-0.5"></span>
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Smart Prep Schedule */}
                <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50">
                  <h4 className="text-[11px] font-bold tracking-widest uppercase text-indigo-500 mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Efficiency Prep Schedule
                  </h4>
                  <div className="space-y-2.5">
                    {meal.steps.map((step, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="text-[11px] font-medium text-indigo-400 mt-0.5 shrink-0 min-w-[36px]">T-{((meal.steps.length - i) * 5)}m</div>
                        <div className="text-[12px] text-indigo-900 leading-snug">{step}</div>
                      </div>
                    ))}
                    <div className="flex gap-3 items-start pt-1">
                      <div className="text-[11px] font-bold text-indigo-600 mt-0.5 shrink-0 min-w-[36px]">T-0m</div>
                      <div className="text-[12px] font-bold text-indigo-900 leading-snug">Ready to serve!</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        );
      })()}

      {/* SWAP ENGINE BOTTOM SHEET */}
      {swappingMealIndex !== null && (() => {
        const targetMeal = dayPlan[swappingMealIndex];
        return (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 cursor-pointer" 
              onClick={() => setSwappingMealIndex(null)}
            ></motion.div>
            <motion.div 
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="absolute bottom-0 inset-x-0 bg-white rounded-t-[40px] z-50 p-6 pt-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-12 flex flex-col max-h-[85vh]"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0"></div>
              <div className="flex items-center justify-between mb-1 shrink-0">
                <h2 className="text-[20px] font-medium tracking-tight text-black">Swap {targetMeal?.type || 'Meal'}</h2>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => {
                      if (!showSwapFiltersPanel) {
                        setDraftSwapFilter(swapFilter);
                        setDraftMaxPrepTime(maxPrepTime);
                        setDraftMaxCost(maxCost);
                        setDraftMinProtein(minProtein);
                        setDraftPantryReadyOnly(pantryReadyOnly);
                      }
                      setShowSwapFiltersPanel(!showSwapFiltersPanel);
                    }}
                    className={`relative p-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                      showSwapFiltersPanel 
                        ? 'bg-black text-white shadow-md' 
                        : (maxPrepTime !== 45 || maxCost !== 10.0 || minProtein !== 10 || pantryReadyOnly)
                          ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                          : 'bg-gray-100 text-black hover:text-gray-600'
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    {(maxPrepTime !== 45 || maxCost !== 10.0 || minProtein !== 10 || pantryReadyOnly) && !showSwapFiltersPanel && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border border-white animate-pulse" />
                    )}
                  </button>
                  <button onClick={() => setSwappingMealIndex(null)} className="text-black hover:text-gray-600 transition-colors bg-gray-100 p-2.5 rounded-full">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-[13px] text-gray-500 font-light mb-4 shrink-0">Alternatives fitting your {targetMeal?.cals || 580} kcal / {targetMeal?.pro || 48}g Protein target.</p>
              
              {/* CURRENT ACTIVE FILTERS NOTIFICATION BADGE BAR */}
              {(maxPrepTime !== 45 || maxCost !== 10.0 || minProtein !== 10 || pantryReadyOnly) && !showSwapFiltersPanel && (
                <div className="flex flex-wrap items-center gap-1.5 mb-4 px-1.5 py-1 bg-orange-50 border border-orange-100 rounded-xl shrink-0">
                  <span className="text-[10px] font-bold text-orange-700 uppercase tracking-widest pl-1">Active:</span>
                  {maxPrepTime !== 45 && (
                    <span className="bg-white border border-orange-200 text-orange-800 text-[10px] px-2 py-0.5 rounded-md font-medium">≤ {maxPrepTime}m</span>
                  )}
                  {maxCost !== 10.0 && (
                    <span className="bg-white border border-orange-200 text-orange-800 text-[10px] px-2 py-0.5 rounded-md font-medium">≤ £{maxCost.toFixed(2)}</span>
                  )}
                  {minProtein !== 10 && (
                    <span className="bg-white border border-orange-200 text-orange-800 text-[10px] px-2 py-0.5 rounded-md font-medium">≥ {minProtein}g Pro</span>
                  )}
                  {pantryReadyOnly && (
                    <span className="bg-white border border-orange-200 text-orange-800 text-[10px] px-2 py-0.5 rounded-md font-medium">Pantry Only</span>
                  )}
                  <button 
                    onClick={() => {
                      setMaxPrepTime(45);
                      setMaxCost(10.0);
                      setMinProtein(10);
                      setPantryReadyOnly(false);
                      setSwapFilter('All');
                    }}
                    className="text-[10px] font-bold text-orange-600 hover:text-orange-800 transition-colors ml-auto pr-1"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* COLLAPSIBLE STATE-DRAFTED FILTER PANEL */}
              {showSwapFiltersPanel && (
                <div className="bg-gray-50/90 border border-gray-150 rounded-3xl p-4 mb-4 space-y-4 shrink-0 shadow-inner animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between pb-1 border-b border-gray-200/50">
                    <span className="text-[12px] font-bold tracking-wider text-gray-500 uppercase">Filter Parameters</span>
                    {(draftMaxPrepTime !== 45 || draftMaxCost !== 10.0 || draftMinProtein !== 10 || draftPantryReadyOnly) && (
                      <button 
                        onClick={() => {
                          setDraftMaxPrepTime(45);
                          setDraftMaxCost(10.0);
                          setDraftMinProtein(10);
                          setDraftPantryReadyOnly(false);
                          setDraftSwapFilter('All');
                        }}
                        className="text-[11px] font-bold text-black hover:text-gray-600 transition-colors"
                      >
                        Reset Panel
                      </button>
                    )}
                  </div>

                  {/* Smart Preset Badges inside panel */}
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">Preset Profiles</label>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                       {[
                         { name: 'All', time: 45, cost: 10.0, pro: 10, pantry: false },
                         { name: 'Quick Prep (≤15m)', time: 15, cost: 10.0, pro: 10, pantry: false },
                         { name: 'Budget (≤£3.50)', time: 45, cost: 3.5, pro: 10, pantry: false },
                         { name: 'Pantry Ready', time: 45, cost: 10.0, pro: 10, pantry: true },
                       ].map(preset => {
                          const isActive = draftSwapFilter === preset.name;
                          return (
                            <button 
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setDraftSwapFilter(preset.name);
                                setDraftMaxPrepTime(preset.time);
                                setDraftMaxCost(preset.cost);
                                setDraftMinProtein(preset.pro);
                                setDraftPantryReadyOnly(preset.pantry);
                              }}
                              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors border ${
                                isActive 
                                  ? 'bg-black text-white border-black shadow-sm' 
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {preset.name}
                            </button>
                          );
                       })}
                    </div>
                  </div>

                  {/* Prep Time Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-[12px]">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>Prep Time Limit</span>
                      </div>
                      <span className="font-extrabold text-black">{draftMaxPrepTime} min max</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-mono">5m</span>
                      <input 
                        type="range" 
                        min="5" 
                        max="45" 
                        step="5"
                        value={draftMaxPrepTime}
                        onChange={(e) => {
                          setDraftMaxPrepTime(Number(e.target.value));
                          setDraftSwapFilter('Custom');
                        }}
                        className="flex-1 accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-[10px] text-gray-400 font-mono">45m</span>
                    </div>
                  </div>

                  {/* Cost Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-[12px]">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <Banknote className="w-3.5 h-3.5 text-gray-400" />
                        <span>Budget Cap</span>
                      </div>
                      <span className="font-extrabold text-black">£{draftMaxCost.toFixed(2)} max</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-mono">£1.00</span>
                      <input 
                        type="range" 
                        min="1.00" 
                        max="10.00" 
                        step="0.50"
                        value={draftMaxCost}
                        onChange={(e) => {
                          setDraftMaxCost(Number(e.target.value));
                          setDraftSwapFilter('Custom');
                        }}
                        className="flex-1 accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-[10px] text-gray-400 font-mono">£10.00</span>
                    </div>
                  </div>

                  {/* Protein Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-[12px]">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <Activity className="w-3.5 h-3.5 text-gray-400" />
                        <span>Minimum Protein</span>
                      </div>
                      <span className="font-extrabold text-black">{draftMinProtein}g min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-mono">10g</span>
                      <input 
                        type="range" 
                        min="10" 
                        max="60" 
                        step="5"
                        value={draftMinProtein}
                        onChange={(e) => {
                          setDraftMinProtein(Number(e.target.value));
                          setDraftSwapFilter('Custom');
                        }}
                        className="flex-1 accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-[10px] text-gray-400 font-mono">60g</span>
                    </div>
                  </div>

                  {/* Pantry Only Toggle */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[12px] font-semibold text-gray-700 flex items-center gap-1.5">
                      <ShoppingBasket className="w-3.5 h-3.5 text-gray-400" /> Pantry Ready Only
                    </span>
                    <button 
                      type="button"
                      onClick={() => {
                        setDraftPantryReadyOnly(!draftPantryReadyOnly);
                        setDraftSwapFilter('Custom');
                      }}
                      className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ${draftPantryReadyOnly ? 'bg-black' : 'bg-gray-200'}`}
                    >
                      <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${draftPantryReadyOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* APPLY BUTTONS ACTION */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSwapFiltersPanel(false);
                      }}
                      className="flex-1 py-3 border border-gray-200 rounded-2xl text-[13px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMaxPrepTime(draftMaxPrepTime);
                        setMaxCost(draftMaxCost);
                        setMinProtein(draftMinProtein);
                        setPantryReadyOnly(draftPantryReadyOnly);
                        setSwapFilter(draftSwapFilter);
                        setShowSwapFiltersPanel(false);
                      }}
                      className="flex-1 py-3 bg-black text-white hover:bg-gray-800 rounded-2xl text-[13px] font-semibold transition-colors shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Apply Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Shortfall Optimization Feature */}
              {proteinShortfall > 0 ? (
                <button 
                  onClick={() => setOptimizeForShortfalls(!optimizeForShortfalls)}
                  className={`px-4 py-3 rounded-2xl border text-[12px] font-medium transition-all duration-300 flex items-center justify-between gap-3 mb-4 shrink-0 ${
                    optimizeForShortfalls 
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/10' 
                      : 'bg-orange-50/70 text-orange-800 border-orange-100 hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-center gap-2 text-left">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <div>
                      <p className="font-semibold text-[13px] leading-tight">Fill Macro Shortfalls</p>
                      <p className="text-[10px] opacity-80 font-normal leading-normal mt-0.5">Missing <span className="font-bold">{proteinShortfall}g protein</span> today. Auto-highlight meals filling this deficit.</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 uppercase tracking-wider transition-colors ${
                    optimizeForShortfalls ? 'bg-amber-700 text-white' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {optimizeForShortfalls ? 'Active' : 'Match'}
                  </span>
                </button>
              ) : (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-4 py-3 rounded-2xl text-[12px] mb-4 flex items-center gap-2 shrink-0">
                  <Check className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="font-semibold text-[13px] leading-tight">Goals Achieved!</p>
                    <p className="text-[10px] opacity-80 mt-0.5">You've hit your daily protein goal. Any swap is healthy!</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 overflow-y-auto hide-scrollbar flex-1 pb-4 pr-1">
                {filteredSwaps.map((alt, i) => {
                  const isBestFit = alt.pro >= 38 && proteinShortfall > 15;
                  const shouldHighlight = optimizeForShortfalls && isBestFit;
                  return (
                    <button 
                      key={i} 
                      onClick={() => handleSwap(alt)} 
                      className={`w-full border rounded-[24px] p-4 flex items-start gap-4 transition-colors text-left group relative overflow-hidden ${
                        shouldHighlight 
                          ? 'border-amber-400 bg-amber-50/20 ring-2 ring-amber-400/20' 
                          : 'bg-[#FAFAFA] border-gray-150 hover:border-black'
                      }`}
                    >
                      {shouldHighlight && (
                        <span className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-sm shadow-amber-500/20">
                          <Sparkles className="w-2.5 h-2.5 fill-white" /> Best Fit (+{alt.pro}g P)
                        </span>
                      )}
                      <div className="w-16 h-16 shrink-0 bg-white rounded-xl overflow-hidden shadow-sm">
                        <img src={alt.img} className="w-full h-full object-cover product-cutout" alt={alt.title}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-medium text-black tracking-tight mb-1 pr-24 truncate">{alt.title}</h3>
                        <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-2">
                           <span>{alt.cals} kcal</span> <span>·</span> <span className={shouldHighlight ? 'text-amber-700 font-bold' : ''}>{alt.pro}g P</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-600 font-medium">
                          <span className={`px-1.5 py-0.5 rounded flex items-center gap-1 ${alt.timeNum <= 15 ? 'bg-amber-50 text-amber-700' : 'bg-gray-100'}`}><Clock className="w-2.5 h-2.5" /> {alt.time}</span>
                          <span className={`px-1.5 py-0.5 rounded flex items-center gap-1 ${alt.costNum <= 3.5 ? 'bg-green-50 text-green-700' : 'bg-gray-100'}`}><Banknote className="w-2.5 h-2.5" /> {alt.cost}</span>
                          <span className={`px-1.5 py-0.5 rounded flex items-center gap-1 ${alt.missing === 0 ? 'bg-blue-50 text-blue-700' : 'bg-gray-100'}`}>
                            {alt.missing === 0 ? <Check className="w-2.5 h-2.5" /> : <ShoppingBasket className="w-2.5 h-2.5" />}
                            {alt.missing === 0 ? 'In Pantry' : `Buy ${alt.missing}`}
                          </span>
                        </div>
                      </div>
                      <div className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center transition-colors mt-2 ${
                        shouldHighlight 
                          ? 'bg-amber-500 border-amber-500 text-white' 
                          : 'bg-white border-gray-200 group-hover:bg-black group-hover:text-white'
                      }`}>
                        <Check className={`w-4 h-4 ${shouldHighlight ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                      </div>
                    </button>
                  );
                })}
                {filteredSwaps.length === 0 && (
                  <div className="py-8 text-center text-gray-400 text-[13px]">
                    No alternatives match this criteria.
                  </div>
                )}
              </div>
              <button onClick={() => setSwappingMealIndex(null)} className="w-full mt-2 py-4 text-[14px] font-medium text-gray-500 hover:text-black transition-colors shrink-0">Cancel</button>
            </motion.div>
          </>
        );
      })()}

      {/* GROCERY LIST BOTTOM SHEET */}
      {showGrocerySheet && (() => {
        const missingItems = [];
        filteredDayPlan.forEach(meal => {
          const missingIngs = getMissingIngredientsForMeal(meal);
          missingIngs.forEach(ing => {
            if (!clearedGroceries[ing]) {
              missingItems.push({
                name: ing,
                mealTitle: meal.title,
                aisle: getAisleForIngredient(ing)
              });
            }
          });
        });

        const activeMissingItems = missingItems;
        const totalCostStr = (activeMissingItems.length * 2.12).toFixed(2);

        const groupedItems = {};
        if (grocerySortMode === 'Aisle') {
          activeMissingItems.forEach(item => {
            if (!groupedItems[item.aisle]) groupedItems[item.aisle] = [];
            groupedItems[item.aisle].push(item);
          });
        } else if (grocerySortMode === 'Freshness') {
           // Mock freshness groups for demonstration
           const freshnessGroups = {
             'Produce': 'Consume within 3-4 Days',
             'Meat & Seafood': 'Consume within 1-2 Days',
             'Dairy': 'Consume within 5-7 Days',
             'Default': 'Pantry / Long Lasting'
           };
           activeMissingItems.forEach(item => {
             const freshGroup = freshnessGroups[item.aisle] || freshnessGroups['Default'];
             if (!groupedItems[freshGroup]) groupedItems[freshGroup] = [];
             groupedItems[freshGroup].push(item);
           });
        } else {
          activeMissingItems.forEach(item => {
            if (!groupedItems[item.mealTitle]) groupedItems[item.mealTitle] = [];
            groupedItems[item.mealTitle].push(item);
          });
        }

        return (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 cursor-pointer" 
              onClick={() => setShowGrocerySheet(false)}
            ></motion.div>
            <motion.div 
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="absolute bottom-0 inset-x-0 bg-white rounded-t-[40px] z-50 p-6 pt-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-12 flex flex-col max-h-[85vh]"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0"></div>
              
              <div className="flex items-center justify-between mb-2 shrink-0">
                <div>
                  <h2 className="text-[20px] font-medium tracking-tight text-black">Grocery List</h2>
                  <p className="text-[12.5px] text-gray-500 font-light mt-0.5">Estimated Cost: ~£{totalCostStr}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleExportGroceries}
                    className="bg-black text-white px-3.5 py-2 rounded-full text-[12px] font-medium flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    {copiedGroceries ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />} 
                    <span className="hidden sm:inline">{copiedGroceries ? 'Copied!' : 'Export'}</span>
                  </button>
                  <button onClick={() => setShowGrocerySheet(false)} className="text-black hover:text-gray-600 transition-colors bg-gray-100 p-2 rounded-full cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 border border-gray-150 p-1.5 rounded-2xl mb-4 shrink-0 overflow-x-auto hide-scrollbar">
                <span className="text-[12px] font-medium text-gray-500 pl-2 pr-2">Group By:</span>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setGrocerySortMode('Aisle')}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${grocerySortMode === 'Aisle' ? 'bg-white text-black shadow-sm border border-gray-100' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    Aisle
                  </button>
                  <button 
                    onClick={() => setGrocerySortMode('Freshness')}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${grocerySortMode === 'Freshness' ? 'bg-white text-black shadow-sm border border-gray-100' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    Freshness
                  </button>
                  <button 
                    onClick={() => setGrocerySortMode('Meal')}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${grocerySortMode === 'Meal' ? 'bg-white text-black shadow-sm border border-gray-100' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    Meal
                  </button>
                </div>
              </div>

              <div className="space-y-4 overflow-y-auto hide-scrollbar flex-1 pb-4 pr-1">
                {Object.keys(groupedItems).map(groupName => (
                  <div key={groupName} className="bg-gray-50/40 border border-gray-100 rounded-2xl p-4">
                    <h3 className="text-[13px] font-semibold text-black tracking-wide mb-3 flex items-center gap-1.5 border-b border-gray-100 pb-1.5 uppercase">
                      {groupName === 'Proteins' && <Beef className="w-3.5 h-3.5 text-red-400" />}
                      {groupName === 'Dairy' && <Milk className="w-3.5 h-3.5 text-blue-400" />}
                      {groupName === 'Produce' && <Carrot className="w-3.5 h-3.5 text-orange-400" />}
                      {groupName === 'Grains & Pantry' && <Wheat className="w-3.5 h-3.5 text-amber-400" />}
                      {groupName === 'Other Aisle' && <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />}
                      {grocerySortMode !== 'Aisle' && <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />}
                      {groupName}
                    </h3>
                    
                    <div className="space-y-2">
                      <AnimatePresence>
                        {[...groupedItems[groupName]]
                          .sort((a, b) => {
                            const aChecked = !!checkedGroceries[a.name];
                            const bChecked = !!checkedGroceries[b.name];
                            return (aChecked === bChecked) ? 0 : aChecked ? 1 : -1;
                          })
                          .map((item) => {
                          const isChecked = !!checkedGroceries[item.name];
                          return (
                            <motion.div 
                              key={item.name}
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: isChecked ? 0.4 : 1, y: 0 }}
                              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                              transition={{ duration: 0.2 }}
                              onClick={() => {
                                const nextChecked = !isChecked;
                                setCheckedGroceries(prev => ({ ...prev, [item.name]: nextChecked }));
                                if (nextChecked) {
                                  triggerHaptic([12, 30, 8]);
                                } else {
                                  triggerHaptic(8);
                                }
                              }}
                              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                                isChecked 
                                  ? 'bg-white/50 border-gray-200 text-gray-400' 
                                  : 'bg-white border-gray-150 hover:border-gray-200 text-gray-700'
                              }`}
                            >
                              <button type="button" className="shrink-0 cursor-pointer">
                                {isChecked ? (
                                  <CheckCircle2 className="w-4 h-4 text-orange-500" strokeWidth={2} />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-300" strokeWidth={2} />
                                )}
                              </button>
                              <span className={`text-[12.5px] leading-tight font-medium flex-1 ${isChecked ? 'line-through text-gray-400' : ''}`}>{item.name}</span>
                              {isChecked && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setClearedGroceries(prev => ({ ...prev, [item.name]: true }));
                                    setCheckedGroceries(prev => {
                                      const next = { ...prev };
                                      delete next[item.name];
                                      return next;
                                    });
                                    triggerHaptic();
                                  }}
                                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}

                {activeMissingItems.length === 0 && (
                  <div className="py-12 text-center text-gray-400 text-[13px]">
                    <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    All ingredients are in pantry or checked off. No items missing!
                  </div>
                )}
              </div>
              <button onClick={() => setShowGrocerySheet(false)} className="w-full mt-2 py-4 text-[14px] font-medium text-gray-500 hover:text-black transition-colors shrink-0 cursor-pointer">Close</button>
            </motion.div>
          </>
        );
      })()}

      {/* QUICK ADD / BACKTRACK LOG BOTTOM SHEET */}
      {showQuickAdd && (
        <>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setShowQuickAdd(false)}></div>
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-[40px] z-50 p-6 pt-4 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-12 flex flex-col max-h-[85vh]">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0"></div>
            
            {quickAddStep === 'select' && (
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h2 className="text-[24px] font-bold tracking-tight text-black">Log Food</h2>
                <button onClick={() => setShowQuickAdd(false)} className="bg-gray-100 hover:bg-gray-200 text-black p-2 rounded-full transition-colors shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {quickAddStep === 'select' && (
              <div className="flex flex-col gap-3 overflow-y-auto hide-scrollbar pb-8">
                <button 
                  onClick={() => setQuickAddStep('scan')} 
                  className="bg-gray-50 border border-gray-100 hover:border-black p-4 rounded-3xl flex items-center gap-4 transition-all group active:scale-[0.98]"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-black group-hover:scale-105 transition-transform shrink-0">
                    <ScanLine className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-[16px] font-semibold text-black mb-0.5">Scan Meal / Barcode</h3>
                    <p className="text-[13px] text-gray-500">Fastest way to log food with camera</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors shrink-0" />
                </button>
                
                <button 
                  onClick={() => setQuickAddStep('text')} 
                  className="bg-gray-50 border border-gray-100 hover:border-black p-4 rounded-3xl flex items-center gap-4 transition-all group active:scale-[0.98]"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-black group-hover:scale-105 transition-transform shrink-0">
                    <Type className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-[16px] font-semibold text-black mb-0.5">Manual Entry</h3>
                    <p className="text-[13px] text-gray-500">Type or use voice to log macros</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors shrink-0" />
                </button>
              </div>
            )}


            {quickAddStep === 'scan' && (
              <div className="flex flex-col flex-1 overflow-y-auto hide-scrollbar pb-4">
                <div className="flex items-center justify-between pb-1 mb-4">
                  <span className="text-[12px] font-bold tracking-wider text-black uppercase">Scan Meal / Barcode</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setQuickAddStep('select');
                      setScannedAlertMessage('');
                    }}
                    className="text-[12px] font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-1"
                  >
                    Cancel
                  </button>
                </div>

                {/* Simulated Viewfinder */}
                <div className="relative w-full h-[220px] bg-black rounded-3xl overflow-hidden flex flex-col items-center justify-center shadow-inner mb-6 shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-0 pointer-events-none"></div>
                  
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 opacity-[0.15] border-[0.5px] border-white grid grid-cols-3 grid-rows-3 pointer-events-none"></div>

                  {isScanningSimulated ? (
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
                      <RefreshCw className="w-8 h-8 text-white animate-spin mb-3" />
                      <p className="text-[14px] font-bold text-white tracking-wide">Reading...</p>
                    </div>
                  ) : scannedAlertMessage ? (
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 animate-in zoom-in-95 duration-200">
                      <CheckCircle2 className="w-12 h-12 text-white mb-2" />
                      <p className="text-[16px] font-bold text-white">{scannedAlertMessage}</p>
                    </div>
                  ) : (
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
                      <ScanLine className="w-10 h-10 text-white/80 mb-3 animate-pulse" />
                      <p className="text-[13px] font-semibold text-white">Align meal or barcode in frame</p>
                    </div>
                  )}

                  {/* Corner Targets */}
                  <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-xl opacity-80"></div>
                  <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-xl opacity-80"></div>
                  <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-xl opacity-80"></div>
                  <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-xl opacity-80"></div>
                </div>

                {/* Preset barcode targets */}
                <div>
                  <span className="block text-[12px] font-bold tracking-widest uppercase text-gray-400 mb-3">Simulate Scan</span>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { 
                        name: 'Grenade Protein Bar', 
                        cals: 220, pro: 20, carbs: 15, fat: 8, 
                        category: 'Snack' 
                      },
                      { 
                        name: 'Arla Skyr Yogurt', 
                        cals: 150, pro: 16, carbs: 6, fat: 1, 
                        category: 'Snack' 
                      },
                      { 
                        name: 'ON Whey Shake', 
                        cals: 140, pro: 24, carbs: 3, fat: 1.5, 
                        category: 'Breakfast' 
                      },
                      { 
                        name: 'Pip & Nut Cookie', 
                        cals: 190, pro: 10, carbs: 14, fat: 9, 
                        category: 'Snack' 
                      },
                    ].map(item => (
                      <button
                        key={item.name}
                        type="button"
                        disabled={isScanningSimulated}
                        onClick={() => {
                          triggerHaptic([15, 40]);
                          setIsScanningSimulated(true);
                          setScannedAlertMessage('');
                          setTimeout(() => {
                            triggerHaptic(30);
                            setIsScanningSimulated(false);
                            setScannedAlertMessage(item.name);
                            setQuickTitle(item.name);
                            setQuickCals(item.cals.toString());
                            setQuickPro(item.pro.toString());
                            setQuickCarbs(item.carbs.toString());
                            setQuickFat(item.fat.toString());
                            setQuickCategory(item.category);
                            setTimeout(() => {
                              setQuickAddStep('text');
                            }, 800);
                          }, 1100);
                        }}
                        className="bg-gray-50 border border-gray-100 hover:border-black hover:bg-gray-100/50 p-3.5 rounded-2xl text-left transition-all group flex flex-col justify-between active:scale-[0.98]"
                      >
                        <span className="text-[13px] font-bold text-black mb-1 group-hover:text-black transition-colors">{item.name}</span>
                        <div className="flex gap-2 text-[11px] text-gray-500 font-medium">
                          <span>{item.cals} kcal</span>
                          <span>•</span>
                          <span>{item.pro}g P</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {quickAddStep === 'text' && (
              <form onSubmit={handleAddOffPlanMeal} className="space-y-4 overflow-y-auto hide-scrollbar flex-1 pb-4">
                <div className="flex items-center justify-between pb-1 mb-2">
                  <span className="text-[12px] font-bold tracking-wider text-black uppercase">Log Entry</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setQuickAddStep('select');
                      setScannedAlertMessage('');
                      setIsListening(false);
                    }}
                    className="text-[12px] font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-1"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2">What did you have?</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Protein Shake" 
                      value={quickTitle}
                      onChange={(e) => setQuickTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-[15px] outline-none focus:border-black focus:bg-white transition-all text-black font-semibold placeholder:font-normal placeholder:text-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic();
                        setIsListening(!isListening);
                        if (!isListening) {
                          setTimeout(() => {
                            triggerHaptic(30);
                            setIsListening(false);
                            setQuickTitle('Banana and 2 Eggs');
                            setQuickCals('250');
                            setQuickPro('14');
                            setQuickCarbs('28');
                            setQuickFat('10');
                            setQuickCategory('Breakfast');
                          }, 3000);
                        }
                      }}
                      className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                        isListening 
                          ? 'bg-orange-500 text-white animate-pulse shadow-md' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                  {isListening && (
                    <div className="text-[12px] text-orange-600 font-medium mt-2 animate-pulse pl-1">
                      Listening... (e.g. "I had a banana and 2 eggs")
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 mb-2">Category</label>
                    <div className="relative">
                      <select 
                        value={quickCategory}
                        onChange={(e) => setQuickCategory(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-[15px] outline-none focus:border-black focus:bg-white transition-all text-black font-semibold appearance-none"
                      >
                        <option value="Snack">Snack</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Extra">Extra</option>
                      </select>
                      <ChevronsUpDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 mb-2">Calories</label>
                    <input 
                      type="number" 
                      value={quickCals}
                      onChange={(e) => setQuickCals(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-[15px] outline-none focus:border-black focus:bg-white transition-all text-black font-semibold"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-2 mt-2">Macros (g)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400">P</span>
                      <input 
                        type="number" 
                        value={quickPro}
                        onChange={(e) => setQuickPro(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-8 pr-3 py-3 text-[15px] outline-none focus:border-black focus:bg-white transition-all text-black font-semibold"
                        min="0"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400">C</span>
                      <input 
                        type="number" 
                        value={quickCarbs}
                        onChange={(e) => setQuickCarbs(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-8 pr-3 py-3 text-[15px] outline-none focus:border-black focus:bg-white transition-all text-black font-semibold"
                        min="0"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400">F</span>
                      <input 
                        type="number" 
                        value={quickFat}
                        onChange={(e) => setQuickFat(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-8 pr-3 py-3 text-[15px] outline-none focus:border-black focus:bg-white transition-all text-black font-semibold"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-black text-white hover:bg-gray-800 transition-colors text-[16px] font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}

      {/* Toast Notification */}
      {moveToast && (
        <div className="absolute bottom-28 left-6 right-6 bg-black text-white p-4 rounded-[20px] shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white shrink-0">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium leading-none">Meal Rescheduled!</p>
            <p className="text-[11px] text-white/70 leading-none mt-1.5">Moved <span className="font-semibold text-white">"{moveToast.mealTitle}"</span> to {moveToast.day}</p>
          </div>
          <button onClick={() => setMoveToast(null)} className="text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}


// --- REST OF THE APP REMAINS THE SAME, INCLUDING SUPERPOWER AESTHETIC ---

function MainScanScreen({ onNavigate }) {
  const [scanMode, setScanMode] = useState('barcode'); 
  const [flashOn, setFlashOn] = useState(false);

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden pb-24">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1588612534571-70e6a394dbdf?auto=format&fit=crop&w=800&q=80" alt="Camera feed" className="w-full h-full object-cover opacity-90 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="px-6 pt-[64px] pb-4 flex justify-center">
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-lg">
            {[
              { id: 'barcode', icon: ScanLine, label: 'Barcode' },
              { id: 'photo', icon: Camera, label: 'Photo' },
              { id: 'shelf', icon: LayoutGrid, label: 'Shelf' }
            ].map((mode) => {
              const isActive = scanMode === mode.id;
              const Icon = mode.icon;
              return (
                <button key={mode.id} onClick={() => setScanMode(mode.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${isActive ? 'bg-white text-black shadow-sm' : 'text-white hover:bg-white/10'}`}>
                  <Icon className="w-3.5 h-3.5" strokeWidth={isActive ? 2.5 : 2} /> {mode.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
           <div className={`relative transition-all duration-500 ease-out flex items-center justify-center ${scanMode === 'barcode' ? 'w-[280px] h-[160px]' : scanMode === 'shelf' ? 'w-[320px] h-[320px]' : 'w-[240px] h-[320px]'}`}>
              <div className="absolute top-0 left-0 w-10 h-10 border-t-[3px] border-l-[3px] border-white rounded-tl-[24px] shadow-[0_0_10px_rgba(0,0,0,0.1)]"></div>
              <div className="absolute top-0 right-0 w-10 h-10 border-t-[3px] border-r-[3px] border-white rounded-tr-[24px] shadow-[0_0_10px_rgba(0,0,0,0.1)]"></div>
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[3px] border-l-[3px] border-white rounded-bl-[24px] shadow-[0_0_10px_rgba(0,0,0,0.1)]"></div>
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[3px] border-r-[3px] border-white rounded-br-[24px] shadow-[0_0_10px_rgba(0,0,0,0.1)]"></div>
           </div>
           <p className="text-[14px] font-medium text-white/90 tracking-tight mt-10 drop-shadow-md transition-all">
             {scanMode === 'barcode' ? 'Point camera at a barcode' : scanMode === 'shelf' ? 'Scan products on a shelf' : 'Take a photo of the front of the product'}
           </p>
        </div>
        <div className="pb-10 px-10 flex items-center justify-between">
           <button onClick={() => onNavigate('missing')} className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-colors">
             <ImageIcon className="w-5 h-5" strokeWidth={1.5} />
           </button>
           <button onClick={() => onNavigate('scanning')} className="w-[76px] h-[76px] rounded-full border-[4px] border-white/40 flex items-center justify-center group active:scale-95 transition-transform">
              <div className="w-[60px] h-[60px] bg-white rounded-full group-hover:scale-95 transition-transform"></div>
           </button>
           <button onClick={() => setFlashOn(!flashOn)} className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-colors">
             {flashOn ? <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" strokeWidth={1.5} /> : <ZapOff className="w-5 h-5 text-white" strokeWidth={1.5} />}
           </button>
        </div>
      </div>
    </div>
  );
}

function ActiveScanScreen({ onComplete, onCancel }) {
  useEffect(() => {
    const timer = setTimeout(() => { onComplete(); }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col h-full bg-black relative animate-in fade-in duration-300 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=800&q=80" alt="Product label" className="w-full h-full object-cover opacity-60 scale-105 filter blur-[3px]" />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="px-6 pt-14 pb-4 flex items-center justify-between">
          <button onClick={onCancel} className="w-10 h-10 flex items-center justify-center text-white bg-white/10 backdrop-blur-md rounded-full active:scale-95 transition-transform"><X className="w-5 h-5" strokeWidth={2} /></button>
          <span className="text-[12px] font-bold tracking-widest uppercase text-white/70 animate-pulse-soft">Detecting</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-8 relative">
           <div className="w-full max-w-[260px] aspect-square relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-white rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-white rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-white rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-white rounded-br-xl"></div>
              <div className="absolute left-0 w-full h-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)] animate-scan-sweep"></div>
           </div>
        </div>
        <div className="pb-16 flex flex-col items-center">
           <Focus className="w-6 h-6 text-white/50 mb-3 animate-spin-slow" strokeWidth={1.5} />
           <p className="text-[15px] font-medium text-white tracking-tight animate-pulse-soft">Analyzing label data...</p>
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ onBack, activeProfile, onSync, onNavigate, initialTab = 'menu' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (activeTab === 'rules') {
    return (
      <RulesScreen 
        onBack={() => {
          if (initialTab === 'rules') {
            onBack();
          } else {
            setActiveTab('menu');
          }
        }} 
      />
    );
  }

  if (activeTab === 'devices') {
    return (
      <DevicesSettingsView 
        onBack={() => {
          setActiveTab('menu');
        }} 
        activeProfile={activeProfile}
        onSync={onSync}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative animate-in fade-in duration-500">
      {/* Settings Header */}
      <div className="px-6 pt-16 pb-4 flex items-center bg-[#FAFAFA] z-20 sticky top-0 bg-opacity-90 backdrop-blur-md border-b border-gray-100">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-100 rounded-full transition-all cursor-pointer">
          <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <div className="flex-1 text-center pr-8">
          <span className="text-[16px] font-semibold tracking-tight text-black">Settings</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pt-6 pb-12 space-y-6">
        {/* Profile Card Summary */}
        <div className="bg-white border border-gray-150 rounded-[28px] p-5 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${activeProfile.color} flex items-center justify-center shadow-sm shrink-0`}>
            <User className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-semibold text-black leading-tight truncate">{activeProfile.name}</h3>
            <p className="text-[12px] text-gray-500 mt-0.5 truncate">{activeProfile.goal}</p>
          </div>
          <button 
            onClick={() => onNavigate('profile')}
            className="text-[12px] font-semibold bg-gray-100 hover:bg-gray-200 text-black px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
          >
            Switch
          </button>
        </div>

        {/* Menu Options Group */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold tracking-widest uppercase text-gray-400 pl-1">Configuration</div>
          
          <div className="bg-white border border-gray-150 rounded-[28px] overflow-hidden shadow-sm divide-y divide-gray-100">
            {/* Rules & Preferences */}
            <button 
              onClick={() => setActiveTab('rules')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-black">Rules & Preferences</h4>
                  <p className="text-[11.5px] text-gray-500 font-light mt-0.5">Philosophy, exclusions & allergens</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
            </button>

            {/* Connected Devices */}
            <button 
              onClick={() => setActiveTab('devices')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-black">Connected Devices</h4>
                  <p className="text-[11.5px] text-gray-500 font-light mt-0.5">Sync Strava, Apple Health, Oura</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
            </button>
          </div>
        </div>

        {/* Tools Options Group */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold tracking-widest uppercase text-gray-400 pl-1">Tools & Utilities</div>
          
          <div className="bg-white border border-gray-150 rounded-[28px] overflow-hidden shadow-sm divide-y divide-gray-100">
            {/* Nutrition Calculator */}
            <button 
              onClick={() => onNavigate('calculator')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <Calculator className="w-5 h-5 text-purple-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-black">Nutrition Calculator</h4>
                  <p className="text-[11.5px] text-gray-500 font-light mt-0.5">Calculate calorie & macro targets</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="pt-4 text-center">
          <p className="text-[11px] text-gray-400 font-medium">Diet Audit & Plan v1.2</p>
          <p className="text-[10px] text-gray-400 font-light mt-0.5">Synced with health database</p>
        </div>
      </div>
    </div>
  );
}

function DevicesSettingsView({ onBack, activeProfile, onSync }) {
  const [isSyncing, setIsSyncing] = useState({
    strava: false,
    appleHealth: false,
    oura: false
  });
  const [connections, setConnections] = useState({
    strava: false,
    appleHealth: true, // defaulted to connected
    oura: !!activeProfile.sleepData
  });

  const handleToggleConnection = (device) => {
    if (device === 'appleHealth') return; // Keep connected by default
    
    if (connections[device]) {
      // Disconnect
      setConnections(prev => ({ ...prev, [device]: false }));
    } else {
      // Connecting / Syncing
      setIsSyncing(prev => ({ ...prev, [device]: true }));
      setTimeout(() => {
        setIsSyncing(prev => ({ ...prev, [device]: false }));
        setConnections(prev => ({ ...prev, [device]: true }));
        if (device === 'oura' || device === 'strava') {
          onSync();
        }
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative animate-in slide-in-from-right-8 duration-500">
      {/* Header */}
      <div className="px-6 pt-16 pb-4 flex items-center bg-[#FAFAFA] z-20 sticky top-0 bg-opacity-90 backdrop-blur-md border-b border-gray-100">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-100 rounded-full transition-all cursor-pointer">
          <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <div className="flex-1 text-center pr-8">
          <span className="text-[16px] font-semibold tracking-tight text-black">Connected Devices</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pt-6 pb-12 space-y-6">
        <div>
          <h2 className="text-[18px] font-medium tracking-tight text-black mb-1">Health Integrations</h2>
          <p className="text-[13px] text-gray-500 font-light leading-relaxed">
            Connect your favorite fitness trackers, smart rings, and wearables to automate your caloric expenditure and rest calculation.
          </p>
        </div>

        {/* Devices List */}
        <div className="space-y-4">
          {/* Strava */}
          <div className="bg-white border border-gray-150 rounded-[28px] p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6 text-orange-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-black">Strava</h3>
                  <p className="text-[12px] text-orange-600 font-medium">Workouts & Running Logs</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggleConnection('strava')}
                disabled={isSyncing.strava}
                className={`text-[12px] font-semibold px-4 py-2 rounded-full transition-all cursor-pointer ${
                  connections.strava 
                    ? 'bg-orange-50 hover:bg-orange-100 text-orange-700' 
                    : 'bg-black hover:bg-gray-800 text-white'
                }`}
              >
                {isSyncing.strava ? 'Linking...' : (connections.strava ? 'Connected' : 'Link')}
              </button>
            </div>
            <p className="text-[12px] text-gray-500 font-light leading-snug">
              Automatically imports your active heart rate, runs, cycle rides, and calorie burns to adjust your daily protein and energy targets.
            </p>
            {connections.strava && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span>Last Synced: Just now</span>
                <span className="text-green-600 flex items-center gap-1">● Active Link</span>
              </div>
            )}
          </div>

          {/* Apple Health */}
          <div className="bg-white border border-gray-150 rounded-[28px] p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-red-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-black">Apple Health</h3>
                  <p className="text-[12px] text-red-600 font-medium">Steps & Passive Energy</p>
                </div>
              </div>
              <button 
                disabled
                className="text-[12px] font-semibold px-4 py-2 bg-gray-50 text-gray-400 rounded-full cursor-not-allowed"
              >
                Connected
              </button>
            </div>
            <p className="text-[12px] text-gray-500 font-light leading-snug">
              Syncs steps and passive calorie expenditure in the background. Enabled via browser companion permissions.
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
              <span>Last Synced: 2 mins ago</span>
              <span className="text-green-600 flex items-center gap-1">● Active Link</span>
            </div>
          </div>

          {/* Oura Ring */}
          <div className="bg-white border border-gray-150 rounded-[28px] p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Moon className="w-6 h-6 text-indigo-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-black">Oura Ring</h3>
                  <p className="text-[12px] text-indigo-600 font-medium">Sleep & Recovery Score</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggleConnection('oura')}
                disabled={isSyncing.oura}
                className={`text-[12px] font-semibold px-4 py-2 rounded-full transition-all cursor-pointer ${
                  connections.oura 
                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700' 
                    : 'bg-black hover:bg-gray-800 text-white'
                }`}
              >
                {isSyncing.oura ? 'Linking...' : (connections.oura ? 'Connected' : 'Link')}
              </button>
            </div>
            <p className="text-[12px] text-gray-500 font-light leading-snug">
              Analyzes sleep duration, deep sleep phases, and body readiness score to adjust carbohydrate allocations and fuel planning.
            </p>
            {connections.oura && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span>Last Synced: Just now</span>
                <span className="text-green-600 flex items-center gap-1">● Active Link</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RulesScreen({ onBack }) {
  const [activeTags, setActiveTags] = useState(['Modern Food Audit']);
  const [customExclusion, setCustomExclusion] = useState('');
  const [exclusions, setExclusions] = useState(['Mushrooms', 'Coriander']);

  const sections = [
    { title: 'Dietary Philosophy', tags: ['Modern Food Audit', 'High-Protein Fat Loss', 'Seed-Oil-Free', 'Animal-Based', 'Vegan', 'Vegetarian', 'Pescatarian', 'Keto', 'Paleo'] },
    { title: 'Allergies & Intolerances', tags: ['Dairy-Free', 'Gluten-Free', 'Nut-Free', 'Shellfish-Free', 'Soy-Free', 'Egg-Free'] },
  ];

  const handleTagToggle = (tag) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddExclusion = (e) => {
    e.preventDefault();
    if (customExclusion.trim() && !exclusions.includes(customExclusion.trim())) {
      setExclusions(prev => [...prev, customExclusion.trim()]);
      setCustomExclusion('');
    }
  };

  const handleRemoveExclusion = (item) => {
    setExclusions(prev => prev.filter(i => i !== item));
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative animate-in slide-in-from-bottom-8 duration-500">
      <div className="px-6 pt-14 pb-4 flex items-center bg-[#FAFAFA] z-20 sticky top-0 bg-opacity-90 backdrop-blur-md">
        <div className="flex-1"></div>
        <div className="flex-1 text-center"><span className="text-[14px] font-medium tracking-tight text-black">Rules & Preferences</span></div>
        <div className="flex-1 flex justify-end">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-black bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-4 h-4" strokeWidth={2} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-12">
        <h1 className="text-[36px] font-medium leading-[1.05] tracking-tight text-black mb-10 mt-2 max-w-[280px]">Personalise your audit</h1>
        
        {sections.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h2 className="text-[18px] font-medium tracking-tight text-black mb-4">{section.title}</h2>
            <div className="flex flex-wrap gap-2">
              {section.tags.map(tag => {
                const isActive = activeTags.includes(tag);
                return (
                  <button 
                    key={tag} 
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2.5 rounded-[12px] text-[13px] font-medium transition-all shadow-sm ${isActive ? 'bg-black text-white border-black' : 'bg-white border border-gray-200 text-black hover:border-gray-400'}`}>
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mb-8">
          <h2 className="text-[18px] font-medium tracking-tight text-black mb-2">Dislikes & Exclusions</h2>
          <p className="text-[13px] text-gray-500 font-light mb-4">Blacklist ingredients or dishes you don't want recommended.</p>
          
          <form onSubmit={handleAddExclusion} className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={customExclusion}
              onChange={(e) => setCustomExclusion(e.target.value)}
              placeholder="e.g. Olives, Spicy food, Aubergine..." 
              className="flex-1 bg-white border border-gray-200 rounded-[12px] px-4 py-3 text-[14px] outline-none focus:border-black transition-colors"
            />
            <button type="submit" className="bg-black text-white px-5 rounded-[12px] font-medium text-[14px] hover:bg-gray-800 transition-colors">
              Add
            </button>
          </form>

          {exclusions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {exclusions.map(item => (
                <div key={item} className="flex items-center gap-2 pl-3 pr-2 py-2 bg-gray-100 rounded-[10px] text-[13px] font-medium border border-gray-200/50">
                  <span>{item}</span>
                  <button onClick={() => handleRemoveExclusion(item)} className="p-0.5 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CalculatorScreen({ onBack }) {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState(80); // kg
  const [height, setHeight] = useState(180); // cm
  const [activity, setActivity] = useState('active'); 
  const [goal, setGoal] = useState('build_muscle'); 

  const calculateResults = () => {
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += gender === 'male' ? 5 : -161;

    const activityMultipliers = {
      sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9
    };
    const tdee = bmr * activityMultipliers[activity];

    let targetCals = tdee;
    let proteinTarget = 1.8 * weight; // maintain

    if (goal === 'lose_weight') {
      targetCals = tdee - 500;
      proteinTarget = 2.2 * weight; // higher protein for retention
    } else if (goal === 'build_muscle') {
      targetCals = tdee + 300;
      proteinTarget = 2.2 * weight;
    }

    const calculatedBmi = weight / Math.pow(height / 100, 2);
    let bmiCat = 'Normal';
    if (calculatedBmi < 18.5) bmiCat = 'Underweight';
    else if (calculatedBmi >= 25 && calculatedBmi < 30) bmiCat = 'Overweight';
    else if (calculatedBmi >= 30) bmiCat = 'Obese';

    return {
      cals: Math.round(targetCals),
      pro: Math.round(proteinTarget),
      bmi: calculatedBmi.toFixed(1),
      bmiCat
    };
  };

  const results = calculateResults();

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative animate-in slide-in-from-right-8 duration-500">
      <div className="px-6 pt-16 pb-2 flex items-center bg-[#FAFAFA] z-20 sticky top-0 bg-opacity-90 backdrop-blur-md">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-black"><ChevronLeft className="w-6 h-6" strokeWidth={1.5} /></button>
        <div className="flex-1 text-center pr-8">
          <span className="text-[14px] font-medium tracking-tight text-black">Nutrition Calculator</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-12 pt-4">
        
        {/* Results Card */}
        <div className="bg-black text-white rounded-[24px] p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="text-[11px] text-white/60 font-bold uppercase tracking-widest mb-1">Target Calories</div>
              <div className="text-[36px] font-medium leading-none">{results.cals} <span className="text-[16px] font-light text-white/50">kcal</span></div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-white/60 font-bold uppercase tracking-widest mb-1">Protein Goal</div>
              <div className="text-[24px] font-medium leading-none">{results.pro}<span className="text-[14px] font-light text-white/50">g</span></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <div>
              <div className="text-[11px] text-white/60 font-medium mb-0.5">Your BMI</div>
              <div className="text-[16px] font-medium">{results.bmi}</div>
            </div>
            <div className="px-3 py-1 bg-white/10 rounded-full text-[12px] font-medium">
              {results.bmiCat}
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Gender</label>
              <div className="flex bg-gray-100 p-1 rounded-[14px]">
                {['male', 'female'].map(g => (
                  <button 
                    key={g} onClick={() => setGender(g)}
                    className={`flex-1 py-2 text-[13px] font-medium capitalize rounded-[10px] transition-colors ${gender === g ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
                  >{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Age</label>
              <input type="number" value={age} onChange={e=>setAge(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium outline-none focus:border-black" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Weight (kg)</label>
              <input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Height (cm)</label>
              <input type="number" value={height} onChange={e=>setHeight(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium outline-none focus:border-black" />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Activity Level</label>
            <select value={activity} onChange={e=>setActivity(e.target.value)} className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-3 text-[15px] font-medium outline-none focus:border-black appearance-none">
              <option value="sedentary">Sedentary (office job)</option>
              <option value="light">Lightly Active (1-3 days/wk)</option>
              <option value="moderate">Moderately Active (3-5 days/wk)</option>
              <option value="active">Active (6-7 days/wk)</option>
              <option value="very_active">Very Active (physical job)</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Primary Goal</label>
            <div className="grid gap-2">
              {[
                { id: 'lose_weight', label: 'Lose Weight (-500 cal)' },
                { id: 'maintain', label: 'Maintain Weight' },
                { id: 'build_muscle', label: 'Build Muscle (+300 cal)' }
              ].map(g => (
                <button 
                  key={g.id} onClick={() => setGoal(g.id)}
                  className={`px-4 py-3 text-left text-[14px] font-medium rounded-[14px] border transition-colors ${goal === g.id ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ onNavigate, profiles, setProfiles, activeProfileId, setActiveProfileId, activeProfile }) {
  const [showSwitcher, setShowSwitcher] = useState(false);

  const ActiveIcon = activeProfile.icon;

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative animate-in fade-in duration-500 pb-24">
      <div className="px-6 pt-16 pb-2 flex items-center justify-between sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-md z-20">
        <h1 className="text-[20px] font-medium tracking-tight text-black">Profile</h1>
        <button onClick={() => onNavigate('settings')} className="text-black hover:text-gray-500 transition-colors">
          <Settings className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pt-6 pb-8">
        {/* Profile Header & Switcher Trigger */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${activeProfile.color} flex items-center justify-center shadow-sm shrink-0 relative`}>
              <ActiveIcon className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <h2 className="text-[24px] font-medium tracking-tight text-black leading-none mb-1.5">{activeProfile.name}</h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm">
                <Target className="w-3.5 h-3.5 text-black" strokeWidth={2} />
                <span className="text-[12px] font-medium text-black tracking-tight">Goal: {activeProfile.goal}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowSwitcher(true)}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-black hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>



        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="col-span-2 flex justify-between items-center bg-black text-white p-5 rounded-[24px] shadow-lg">
             <div className="flex flex-col">
               <span className="text-[11px] font-bold text-white/60 tracking-widest uppercase mb-1">Health Score</span>
               <span className="text-[32px] font-medium leading-none">{activeProfile.healthScore}<span className="text-[16px] font-light text-white/50">/100</span></span>
             </div>
             <div className="w-12 h-12 rounded-full border-[4px] border-white/20 flex items-center justify-center relative">
               <Target className="w-5 h-5 text-white" strokeWidth={2} />
               <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle cx="20" cy="20" r="18" fill="none" stroke="white" strokeWidth="4" strokeDasharray="113" strokeDashoffset={113 - (113 * activeProfile.healthScore) / 100} className="transition-all duration-1000 ease-out" />
               </svg>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white border border-gray-100 rounded-[24px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between aspect-[4/3]">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Flame className="w-4 h-4 text-orange-400" strokeWidth={2} />
              <span className="text-[11px] font-bold tracking-widest uppercase text-black">Avg Intake</span>
            </div>
            <div>
              <div className="text-[32px] font-medium tracking-tight text-black leading-none mb-1">{activeProfile.calorieIntake.toLocaleString()}</div>
              <div className="text-[13px] text-gray-500 font-light">kcal / day</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[24px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between aspect-[4/3]">
            <div className="flex items-center gap-1.5 text-gray-400">
               <Activity className="w-4 h-4 text-blue-400" strokeWidth={2} />
               <span className="text-[11px] font-bold tracking-widest uppercase text-black">Avg Protein</span>
            </div>
            <div>
               <div className="text-[32px] font-medium tracking-tight text-black leading-none mb-1">{activeProfile.proteinIntake}g</div>
               <div className="text-[13px] text-gray-500 font-light">per day</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[24px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between aspect-[4/3]">
            <div className="flex items-center gap-1.5 text-gray-400">
               <Activity className="w-4 h-4 text-green-500" strokeWidth={2} />
               <span className="text-[11px] font-bold tracking-widest uppercase text-black">Current BMI</span>
            </div>
            <div>
               <div className="text-[32px] font-medium tracking-tight text-black leading-none mb-1">{activeProfile.bmi}</div>
               <div className="text-[13px] text-gray-500 font-light">Normal Weight</div>
            </div>
          </div>
          
          <button onClick={() => onNavigate('calculator')} className="bg-[#FAFAFA] border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-[24px] p-5 flex flex-col items-center justify-center gap-2 aspect-[4/3]">
            <Calculator className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-gray-500 tracking-tight text-center">Nutrition<br/>Calculator</span>
          </button>
        </div>
      </div>

      {/* Switcher Modal/Sheet */}
      {showSwitcher && (
        <>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setShowSwitcher(false)}></div>
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-[40px] z-50 p-6 pt-4 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-12">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0"></div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] font-medium tracking-tight text-black">Switch Profile</h2>
              <button onClick={() => setShowSwitcher(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-black hover:bg-gray-200"><X className="w-4 h-4" strokeWidth={2} /></button>
            </div>
            <div className="space-y-3 mb-4">
              {profiles.map(p => (
                <button 
                  key={p.id}
                  onClick={() => { setActiveProfileId(p.id); setShowSwitcher(false); }}
                  className={`w-full flex items-center p-4 rounded-[20px] border transition-all ${activeProfileId === p.id ? 'border-black bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center mr-4 shrink-0`}>
                    <p.icon className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-[15px] font-medium text-black">{p.name}</h3>
                    <p className="text-[12px] text-gray-500">{p.goal}</p>
                  </div>
                  {activeProfileId === p.id && (
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button 
              className="w-full flex items-center justify-center gap-2 p-4 rounded-[20px] border-2 border-dashed border-gray-200 bg-[#FAFAFA] text-black font-medium hover:bg-gray-50 hover:border-gray-300 transition-all text-[14px]"
            >
              <Plus className="w-4 h-4" /> Add Family Member
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ActivityScreen({ activeProfile, onSync, onNavigate }) {
  // Mock detailed activity data
  const getProfileActivityDetails = () => {
    switch (activeProfile.id) {
      case '1': // Alex Demo (Muscle builder, active)
        return {
          restingHeartRate: '56',
          vo2Max: '48.5',
          intensityMinutes: '45m',
          workouts: [
            { id: 1, type: 'Run', detail: '5.2 km · 28m', calories: '340 kcal', typeTag: 'Running' },
            { id: 2, type: 'Strength', detail: 'Hypertrophy · 45m', calories: '240 kcal', typeTag: 'Gym' },
            { id: 3, type: 'Walk', detail: 'Active Recovery · 15m', calories: '65 kcal', typeTag: 'Walk' }
          ]
        };
      case '2': // Mia (Child 6yo)
        return {
          restingHeartRate: '72',
          vo2Max: '—',
          intensityMinutes: '60m',
          workouts: [
            { id: 1, type: 'Playground', detail: 'Outdoor Run & Jump · 45m', calories: '180 kcal', typeTag: 'Play' },
            { id: 2, type: 'Park Walk', detail: 'Family Walk · 25m', calories: '75 kcal', typeTag: 'Walk' }
          ]
        };
      case '3': // Leo (Child 10yo)
        return {
          restingHeartRate: '64',
          vo2Max: '52.1',
          intensityMinutes: '90m',
          workouts: [
            { id: 1, type: 'Football', detail: 'Practice · 60m', calories: '450 kcal', typeTag: 'Sport' },
            { id: 2, type: 'Bicycle', detail: 'To School · 30m', calories: '180 kcal', typeTag: 'Cycling' }
          ]
        };
      default:
        return {
          restingHeartRate: '60',
          vo2Max: '45.0',
          intensityMinutes: '30m',
          workouts: []
        };
    }
  };

  const details = getProfileActivityDetails();

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative animate-in fade-in duration-500 pb-24 overflow-y-auto hide-scrollbar">
      <div className="px-6 pt-16 pb-4 flex items-center justify-between sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-md z-20">
        <h1 className="text-[24px] font-black tracking-tight text-black">ACTIVITY</h1>
      </div>
      
      <div className="px-6 space-y-6 pt-2">
        {/* Massive Primary Metrics */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-150 rounded-[32px] p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">STEPS</span>
              <div className="text-[44px] font-black tracking-tighter text-black leading-none mt-1">
                {activeProfile.activityData?.steps || '0'}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[13px] font-bold text-orange-500 block">42% of goal</span>
              <span className="text-[11px] text-gray-400 mt-1 block">Goal: 10,000</span>
            </div>
          </div>

          <div className="bg-white border border-gray-150 rounded-[32px] p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">ACTIVE KCALS</span>
              <div className="text-[44px] font-black tracking-tighter text-red-500 leading-none mt-1">
                {activeProfile.activityData?.caloriesBurned || '0'}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[13px] font-bold text-red-500 block">Burned</span>
              <span className="text-[11px] text-gray-400 mt-1 block">Active energy</span>
            </div>
          </div>
        </div>

        {/* Ultra-Minimal Physiological Grid */}
        <div className="bg-white border border-gray-150 rounded-[32px] p-6 shadow-sm">
          <div className="grid grid-cols-3 gap-2 divide-x divide-gray-100">
            <div className="text-center px-2">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase block mb-1">REST HR</span>
              <span className="text-[22px] font-extrabold text-black tracking-tight leading-none">{details.restingHeartRate}</span>
              <span className="text-[10px] text-gray-400 block mt-1">bpm</span>
            </div>
            <div className="text-center px-2">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase block mb-1">VO2 MAX</span>
              <span className="text-[22px] font-extrabold text-black tracking-tight leading-none">{details.vo2Max}</span>
              <span className="text-[10px] text-gray-400 block mt-1">score</span>
            </div>
            <div className="text-center px-2">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase block mb-1">ACTIVE</span>
              <span className="text-[22px] font-extrabold text-black tracking-tight leading-none">{details.intensityMinutes}</span>
              <span className="text-[10px] text-gray-400 block mt-1">today</span>
            </div>
          </div>
        </div>

        {/* Minimalist Workouts list */}
        <div className="space-y-3">
          <h2 className="text-[12px] font-bold tracking-widest uppercase text-gray-400 pl-1">WORKOUTS</h2>
          <div className="space-y-2">
            {details.workouts.map(workout => (
              <div key={workout.id} className="bg-white border border-gray-150 rounded-[20px] p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                    <Activity className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-[13.5px] font-bold text-black leading-tight">{workout.type}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">{workout.detail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[13.5px] font-black text-black block">{workout.calories}</span>
                </div>
              </div>
            ))}

            {details.workouts.length === 0 && (
              <div className="bg-white border border-dashed border-gray-200 rounded-[20px] p-6 text-center text-gray-400 text-[12px]">
                No workouts synced.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SleepScreen({ activeProfile, onSync, onNavigate }) {
  // Detailed sleep stages and recovery biomarkers depending on sleep score / profile
  const getSleepMetrics = () => {
    if (!activeProfile.sleepData) {
      return null;
    }

    const isHighScore = activeProfile.sleepData.score >= 80;
    
    return {
      stages: [
        { label: 'DEEP', duration: isHighScore ? '2h 05m' : '1h 12m', pct: isHighScore ? 25 : 19, color: 'bg-indigo-600' },
        { label: 'REM', duration: isHighScore ? '1h 55m' : '1h 05m', pct: isHighScore ? 23 : 18, color: 'bg-purple-500' },
        { label: 'LIGHT', duration: isHighScore ? '4h 00m' : '3h 16m', pct: isHighScore ? 48 : 56, color: 'bg-blue-400' },
        { label: 'AWAKE', duration: isHighScore ? '20m' : '25m', pct: isHighScore ? 4 : 7, color: 'bg-gray-300' }
      ],
      biomarkers: [
        { label: 'HRV', value: isHighScore ? '84 ms' : '58 ms', icon: TrendingUp, color: 'text-green-500' },
        { label: 'REST HR', value: isHighScore ? '48 bpm' : '54 bpm', icon: Heart, color: 'text-red-500' },
        { label: 'SpO2', value: isHighScore ? '99.1%' : '98.0%', icon: Droplets, color: 'text-blue-500' },
        { label: 'RESP RATE', value: isHighScore ? '13.8 /m' : '14.5 /m', icon: Activity, color: 'text-indigo-500' }
      ]
    };
  };

  const metrics = getSleepMetrics();

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative animate-in fade-in duration-500 pb-24 overflow-y-auto hide-scrollbar">
      <div className="px-6 pt-16 pb-4 flex items-center justify-between sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-md z-20">
        <h1 className="text-[24px] font-black tracking-tight text-black">SLEEP</h1>
      </div>

      <div className="px-6 space-y-6 pt-2">
        {/* Main Sleep Quality Card */}
        <div className="bg-black text-white p-6 rounded-[32px] shadow-lg flex items-center justify-between">
           <div>
             <span className="text-[11px] font-bold text-white/50 tracking-widest uppercase">SLEEP SCORE</span>
             <div className="text-[64px] font-black tracking-tighter leading-none mt-1">
               {activeProfile.sleepData ? activeProfile.sleepData.score : '--'}
               <span className="text-[18px] font-light text-white/40">/100</span>
             </div>
           </div>
           <div className="text-right">
             <span className="text-[14px] font-bold text-indigo-400 block uppercase">
               {activeProfile.sleepData ? 'Optimal' : 'No Data'}
             </span>
             <span className="text-[11px] text-white/50 mt-1 block">Recovery state</span>
           </div>
        </div>

        {/* Total Sleep Duration Card */}
        {activeProfile.sleepData && (
          <div className="bg-white border border-gray-150 rounded-[32px] p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">SLEEP DURATION</span>
              <div className="text-[40px] font-black tracking-tighter text-indigo-600 leading-none mt-1">
                {activeProfile.sleepData.duration}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[12px] font-semibold text-gray-500 block">{activeProfile.sleepData.adjustment}</span>
            </div>
          </div>
        )}

        {/* Dynamic Sleep Metrics Sections */}
        {metrics ? (
          <>
            {/* Sleep Stage Architecture */}
            <div className="bg-white border border-gray-150 rounded-[32px] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">STAGES</span>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Architecture</span>
              </div>

              {/* Stacked Progress Bar representation */}
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                {metrics.stages.map((stage, i) => (
                  <div 
                    key={i} 
                    style={{ width: `${stage.pct}%` }} 
                    className={`${stage.color} h-full transition-all duration-500`}
                  />
                ))}
              </div>

              {/* Stages List Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-1">
                {metrics.stages.map((stage, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                      <span className="text-[12.5px] font-bold text-gray-500">{stage.label}</span>
                    </div>
                    <span className="text-[12.5px] font-black text-black">{stage.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Physiological Biomarkers */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400 pl-1">BIOMARKERS</span>
              <div className="grid grid-cols-2 gap-3">
                {metrics.biomarkers.map((bio, i) => {
                  return (
                    <div key={i} className="bg-white border border-gray-150 rounded-[24px] p-5 shadow-sm flex flex-col justify-between h-[95px]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">{bio.label}</span>
                      <span className="text-[20px] font-black text-black leading-none block">{bio.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white border border-gray-150 rounded-[32px] p-6 text-center space-y-4 shadow-sm">
            <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-black">No Sleep Data</h3>
              <p className="text-[11.5px] text-gray-400 font-light mt-1 max-w-[220px] mx-auto">
                Connect Oura Ring or Apple Health in settings to enable.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('settings')}
              className="text-[12px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              Configure Sleep Sync
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ScanResultScreen({ onBack }) {
  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative animate-in slide-in-from-right-8 duration-500">
      <div className="px-6 pt-14 pb-2 flex items-center bg-[#FAFAFA] z-20 sticky top-0 bg-opacity-90 backdrop-blur-md">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-black"><ChevronLeft className="w-6 h-6" strokeWidth={1.5} /></button>
        <div className="flex-1 text-center pr-8"><span className="text-[14px] font-medium tracking-tight text-black">Scan result</span></div>
      </div>
      <div className="flex-1 px-6 pt-4"><p>Scan result goes here.</p></div>
    </div>
  );
}

function MissingProductScreen({ onBack }) {
  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative animate-in slide-in-from-bottom-8 duration-500">
      <div className="px-6 pt-14 pb-4 flex items-center bg-[#FAFAFA] z-20 sticky top-0">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-black bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-4 h-4" strokeWidth={2} /></button>
      </div>
      <div className="flex-1 px-6"><p>Missing Product flow goes here.</p></div>
    </div>
  );
}

function ProScreen({ onBack }) {
  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative animate-in fade-in duration-500 pb-24">
      <div className="px-6 pt-16 pb-4"><h1 className="text-[36px] font-medium tracking-tight text-black">Upgrade</h1></div>
    </div>
  );
}

function HeroScreen({ onNext }) {
  return (
    <div className="flex flex-col h-full relative animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col px-8 relative z-10 pt-20 pb-10">
        <h1 className="text-[28px] leading-[1.15] font-medium tracking-tight text-black mb-4 text-center">Go beyond a "health check" to get the food truth.</h1>
        <button onClick={onNext} className="w-full mt-auto bg-[#1A1A1A] text-white rounded-[16px] py-[18px] text-[15px] font-medium active:scale-[0.98]">See the difference</button>
      </div>
    </div>
  );
}

function GoalSelectionScreen({ onBack, onNext }) {
  return (
    <div className="flex flex-col h-full relative animate-in slide-in-from-right-8 duration-500">
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white via-white to-transparent pt-12 pb-8 px-8 z-30">
        <button onClick={onNext} className="w-full rounded-[16px] py-[18px] text-[15px] font-medium transition-all bg-[#1A1A1A] text-white active:scale-[0.98]">Next</button>
      </div>
    </div>
  );
}

function PantryScreen() { return <div/>; }
function MealsScreen() { return <div/>; }
function PlaceholderScreen({ title }) { return <div/>; }

// --- BOTTOM NAVIGATION ---

function BottomNav({ currentView, onNavigate }) {
  const navItems = [
    { id: 'activity', icon: Activity, label: 'Activity' }, 
    { id: 'sleep', icon: Moon, label: 'Sleep' },
    { id: 'scan', icon: Focus, label: 'Scan' }, 
    { id: 'plan', icon: CalendarDays, label: 'Plan' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-6 pt-2 px-4 z-50">
      <div className="flex items-center justify-between max-w-[340px] mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id || (currentView === 'scan-result' && item.id === 'scan');
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} className="flex flex-col items-center justify-center gap-1 p-2 min-w-[50px] group">
              <div className={`flex items-center justify-center transition-all duration-300 ${item.id === 'scan' ? 'w-[44px] h-[44px] bg-[#1A1A1A] rounded-2xl text-white hover:bg-black active:scale-95 shadow-md' : ''}`}>
                <Icon className={`w-[22px] h-[22px] transition-all duration-300 ${item.id === 'scan' ? 'text-white w-5 h-5' : isActive ? 'text-black fill-black/5' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={isActive && item.id !== 'scan' ? 2 : 1.5} />
              </div>
              <span className={`text-[10px] font-medium tracking-wide transition-colors ${isActive && item.id !== 'scan' ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
