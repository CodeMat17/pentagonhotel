import {
  AlarmClockIcon,
  BabyIcon,
  BanknoteIcon,
  BriefcaseIcon,
  CakeIcon,
  CarFrontIcon,
  ChefHatIcon,
  ClockIcon,
  CoffeeIcon,
  ConciergeBellIcon,
  DumbbellIcon,
  EggFriedIcon,
  FlowerIcon,
  Gamepad2Icon,
  KeyRoundIcon,
  LuggageIcon,
  MartiniIcon,
  MoonIcon,
  PlaneIcon,
  PlaneTakeoffIcon,
  PresentationIcon,
  PrinterIcon,
  ShirtIcon,
  SparklesIcon,
  StethoscopeIcon,
  ThermometerIcon,
  UsersIcon,
  UtensilsIcon,
  WavesIcon,
  WifiIcon,
  WineIcon,
} from "lucide-react";

/**
 * Data files reference icons by name so they stay free of JSX. This maps those
 * names to components — a static object, so tree-shaking still works and no
 * dynamic import is involved.
 */
const ICONS = {
  "alarm-clock": AlarmClockIcon,
  baby: BabyIcon,
  banknote: BanknoteIcon,
  briefcase: BriefcaseIcon,
  cake: CakeIcon,
  "car-front": CarFrontIcon,
  "chef-hat": ChefHatIcon,
  clock: ClockIcon,
  coffee: CoffeeIcon,
  "concierge-bell": ConciergeBellIcon,
  dumbbell: DumbbellIcon,
  "egg-fried": EggFriedIcon,
  flower: FlowerIcon,
  "gamepad-2": Gamepad2Icon,
  "key-round": KeyRoundIcon,
  luggage: LuggageIcon,
  martini: MartiniIcon,
  moon: MoonIcon,
  plane: PlaneIcon,
  "plane-takeoff": PlaneTakeoffIcon,
  presentation: PresentationIcon,
  printer: PrinterIcon,
  shirt: ShirtIcon,
  sparkles: SparklesIcon,
  stethoscope: StethoscopeIcon,
  thermometer: ThermometerIcon,
  users: UsersIcon,
  utensils: UtensilsIcon,
  waves: WavesIcon,
  wifi: WifiIcon,
  wine: WineIcon,
} as const;

export function Icon({ name, className }: { name: string; className?: string }) {
  const Component = ICONS[name as keyof typeof ICONS] ?? SparklesIcon;
  return <Component className={className} aria-hidden="true" />;
}
