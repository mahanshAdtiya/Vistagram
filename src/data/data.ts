import {
  FileText,
  Clock,
  Map,
  Square,
  Trash2,
  type LucideIcon,
} from 'lucide-react'

export type Tool = {
  icon: LucideIcon
  label: string
  action: string 
}

const tools: Tool[] = [
  { icon: FileText, label: 'Narrative Node', action: 'create-narrative-node' },
  { icon: Clock, label: 'Timed Narrative', action: 'create-timed-node' },
  { icon: Map, label: 'Explorative Node', action: 'create-explorative-node' },
  { icon: Square, label: 'Simple Node', action: 'create-simple-node' },
  { icon: Trash2, label: 'Delete Edge', action: 'delete-edge' },
]

export default tools
