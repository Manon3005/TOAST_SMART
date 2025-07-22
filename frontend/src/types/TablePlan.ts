import { StatsJson } from "./StatsJson"

export interface TablePlan { 
    addressPlanTable: string,
    addressGroupTable: string,
    statsJson: StatsJson
    rapportJson: {
        nb_table_missing: number,
        nb_student_without_table: number,
        extra_table: number
    }
  }