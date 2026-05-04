/**
 * Icon - Wrapper para iconos de lucide-react con tamaños consistentes
 * Exporta los iconos más usados del sistema
 */

import * as LucideIcons from 'lucide-react'

export default function Icon({ name, size = 18, className = '', ...props }) {
  const IconComponent = LucideIcons[name]

  if (!IconComponent) {
    console.warn(`Icon "${name}" no encontrado en lucide-react`)
    return null
  }

  return <IconComponent size={size} className={className} {...props} />
}

// Exportar iconos comunes para uso directo
export const {
  // Navegación y UI
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  Home,
  LayoutDashboard,
  PlusCircle,

  // Acciones
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  ArrowUpDown,
  Calculator,

  // Estados y feedback
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  Clock,
  Loader,

  // Portales e identidad
  Recycle,
  Building2,
  Factory,
  Shield,
  Eye,
  EyeOff,

  // Lotes y materiales
  Package,
  PackageCheck,
  PackagePlus,
  PackageX,
  Boxes,
  Scale,
  Tag,
  QrCode,
  Leaf,
  Cpu,
  Layers,
  Battery,
  Monitor,
  Speaker,
  Cable,
  Lightbulb,
  TreePine,
  Car,
  Smartphone,
  BarChart3,

  // Documentos y datos
  FileText,
  FileCheck,
  FilePlus,
  Image,

  // Usuario y autenticación
  User,
  Users,
  LogOut,
  LogIn,

  // Ubicación y tracking
  MapPin,
  Navigation,
  Globe,
  TrendingUp,
  TrendingDown,

  // Finanzas y scoring
  DollarSign,
  Award,

  // Utilidades
  Settings,
  Calendar,
  Bell,
  Mail,
  Phone,
  ExternalLink,
  Copy,
  Share2,

  // Dark mode
  Sun,
  Moon,

  // Efectos y decoración
  Sparkles,
} = LucideIcons
