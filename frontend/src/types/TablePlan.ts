import { Rapport } from "./Rapport"
import { StatsJson } from "./StatsJson"

export interface TablePlan { 
    addressPlanTable: string,
    addressGroupTable: string,
    statsJson: StatsJson,
    rapportJson: Rapport
  }